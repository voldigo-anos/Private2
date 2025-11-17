const axios = require("axios");
const fs = require("fs");
const path = require("path");
const validUrl = require("valid-url");
const { v4: uuidv4 } = require("uuid");

const TMP_DIR = path.join(__dirname, "tmp");
if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR);

const HISTORY_FILE = path.join(__dirname, "gpt_history.json");
if (!fs.existsSync(HISTORY_FILE)) fs.writeFileSync(HISTORY_FILE, "{}");

const GPT_API = "https://api.nekolabs.web.id/ai/gpt/5";

// 📌 Charger ou sauvegarder l’historique
const loadHistory = () => JSON.parse(fs.readFileSync(HISTORY_FILE, "utf8"));
const saveHistory = (data) => fs.writeFileSync(HISTORY_FILE, JSON.stringify(data, null, 2));

// 📥 Télécharger fichier
const downloadFile = async (url, ext) => {
  const filePath = path.join(TMP_DIR, `${uuidv4()}.${ext}`);
  const response = await axios.get(url, { responseType: "arraybuffer" });
  fs.writeFileSync(filePath, Buffer.from(response.data));
  return filePath;
};

// ♻️ Reset conversation
const resetConversation = async (api, event, message) => {
  const history = loadHistory();
  delete history[event.senderID];
  saveHistory(history);

  api.setMessageReaction("♻️", event.messageID, () => {}, true);
  return message.reply(`✅ GPT-5 conversation reset for UID: ${event.senderID}`);
};

// 🧠 GPT-5 Main
const handleGPT = async (api, event, message, userInput) => {
  const uid = event.senderID;

  api.setMessageReaction("⏳", event.messageID, () => {}, true);

  let history = loadHistory();
  if (!history[uid]) history[uid] = [];

  // 🔥 Ajout du message utilisateur
  history[uid].push({ role: "user", content: userInput });

  // 🛠 Construire le prompt final
  const fullPrompt = history[uid].map(m => `${m.role}: ${m.content}`).join("\n");

  const url = `${GPT_API}?text=${encodeURIComponent(fullPrompt)}&systemPrompt=${encodeURIComponent("You are a helpful assistant")}`;

  try {
    const response = await axios.get(url);
    if (!response.data?.success) throw new Error("Bad API response.");

    const reply = response.data.result || "⚠️ No reply from GPT-5.";

    // 🔥 Ajouter réponse IA à l’historique
    history[uid].push({ role: "assistant", content: reply });
    saveHistory(history);

    const sent = await message.reply(reply);

    global.GoatBot.onReply.set(sent.messageID, {
      commandName: "gpt5",
      author: uid
    });

    api.setMessageReaction("✅", event.messageID, () => {}, true);
  } catch (error) {
    api.setMessageReaction("❌", event.messageID, () => {}, true);
    console.error("GPT-5 Error:", error.message);
    return message.reply("⚠️ GPT-5 Error:\n" + error.message);
  }
};

module.exports = {
  config: {
    name: "gpt5",
    version: "1.0.0",
    author: "Christus",
    role: 0,
    category: "ai",
    shortDescription: "GPT-5 AI chat",
    longDescription: "Chat complet via GPT-5 NekoLabs avec mémoire utilisateur.",
    guide: {
      en: `
.gpt5 <message> → chat GPT-5  
.gpt5 reset → clear your GPT-5 memory  
Reply to GPT-5 to continue the discussion
`
    }
  },

  onStart: async function ({ api, event, args, message }) {
    const content = args.join(" ").trim();
    if (!content) return message.reply("❗ Enter a message.");

    if (["reset", "clear"].includes(content.toLowerCase()))
      return resetConversation(api, event, message);

    return handleGPT(api, event, message, content);
  },

  onReply: async function ({ api, event, Reply, message }) {
    if (event.senderID !== Reply.author) return;

    const content = event.body?.trim();
    if (!content) return;

    if (["reset", "clear"].includes(content.toLowerCase()))
      return resetConversation(api, event, message);

    return handleGPT(api, event, message, content);
  }
};
