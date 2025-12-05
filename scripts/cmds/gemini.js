const g = require("fca-aryan-nix");
const a = require("axios");

const u_pro = "http://65.109.80.126:20409/aryan/gemini-pro";
const u_text = "http://65.109.80.126:20409/aryan/gemini";

module.exports = {
  config: {
    name: "gemini",
    aliases: ["chat"],
    version: "0.0.2",
    author: "ArYAN",
    countDown: 3,
    role: 0,
    shortDescription: "Ask Gemini AI (Text or Image)",
    longDescription: "Talk with Gemini AI. Reply to an image to ask about it.",
    category: "AI",
    guide: "/gemini [your question] (Reply to an image to use Vision)"
  },

  onStart: async function({ api, event, args }) {
    const p = args.join(" ");
    if (!p) return api.sendMessage("❌ Please provide a question or prompt.", event.threadID, event.messageID);

    api.setMessageReaction("⏳", event.messageID, () => {}, true);

    let imageUrl = null;
    let apiUrl;

    if (event.messageReply && event.messageReply.attachments.length > 0) {
      const replyAttachment = event.messageReply.attachments[0];
      if (['photo', 'sticker', 'animated_image'].includes(replyAttachment.type)) {
        imageUrl = replyAttachment.url;
      }
    }
    else if (event.attachments.length > 0) {
      const msgAttachment = event.attachments[0];
      if (['photo', 'sticker', 'animated_image'].includes(msgAttachment.type)) {
        imageUrl = msgAttachment.url;
      }
    }

    try {
      if (imageUrl) {
        apiUrl = `${u_pro}?prompt=${encodeURIComponent(p)}&url=${encodeURIComponent(imageUrl)}`;
      } else {
        apiUrl = `${u_text}?prompt=${encodeURIComponent(p)}`;
      }

      const r = await a.get(apiUrl);
      const reply = r.data?.response;
      if (!reply) throw new Error("No response from Gemini API.");

      api.setMessageReaction("✅", event.messageID, () => {}, true);

      api.sendMessage(reply, event.threadID, (err, i) => {
        if (!i) return;
        if (!imageUrl) {
          global.GoatBot.onReply.set(i.messageID, { commandName: this.config.name, author: event.senderID });
        }
      }, event.messageID);

    } catch (e) {
      console.error("Gemini Command Error:", e.message);
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      api.sendMessage("⚠ Gemini API a somossa hoyeche.", event.threadID, event.messageID);
    }
  },

  onReply: async function({ api, event, Reply }) {
    if ([api.getCurrentUserID()].includes(event.senderID)) return;
    const p = event.body;
    if (!p) return;

    api.setMessageReaction("⏳", event.messageID, () => {}, true);

    try {
      const r = await a.get(`${u_text}?prompt=${encodeURIComponent(p)}`);
      const reply = r.data?.response;
      if (!reply) throw new Error("No response from Gemini API.");

      api.setMessageReaction("✅", event.messageID, () => {}, true);

      api.sendMessage(reply, event.threadID, (err, i) => {
        if (!i) return;
        global.GoatBot.onReply.set(i.messageID, { commandName: this.config.name, author: event.senderID });
      }, event.messageID);

    } catch (e) {
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      api.sendMessage("⚠ Gemini API er response dite somossa hocchhe.", event.threadID, event.messageID);
    }
  }
};

const w = new g.GoatWrapper(module.exports);
w.applyNoPrefix({ allowPrefix: true });
