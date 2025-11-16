const os = require("os");
const moment = require("moment-timezone");
const { createCanvas } = require("canvas");
const GIFEncoder = require("gifencoder");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "cpanel",
    version: "5.1",
    author: "Christus",
    description: "Generates a futuristic static hex system dashboard with color-changing borders.",
    usage: "cpanel",
    category: "system",
    role: 0
  },

  onStart: async function ({ api, event }) {
    try {
      const width = 1000, height = 700;
      const encoder = new GIFEncoder(width, height);
      const fileName = `cpanel_${Date.now()}.gif`;
      const filePath = path.join(__dirname, fileName);
      const stream = fs.createWriteStream(filePath);
      encoder.createReadStream().pipe(stream);

      encoder.start();
      encoder.setRepeat(0);
      encoder.setDelay(150); 
      encoder.setQuality(10);

      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext("2d");

      const formatUptime = (sec) => {
        const d = Math.floor(sec / 86400);
        const h = Math.floor((sec % 86400) / 3600);
        const m = Math.floor((sec % 3600) / 60);
        return `${d}d ${h}h ${m}m`;
      };

      const getSystemStats = () => {
        const uptime = os.uptime();
        const totalMem = os.totalmem() / 1024 / 1024 / 1024;
        const freeMem = os.freemem() / 1024 / 1024 / 1024;
        const usedMem = totalMem - freeMem;
        return [
          ["BOT UPTIME", formatUptime(process.uptime())],
          ["CPU CORES", os.cpus().length.toString()],
          ["NODE.JS", process.version],
          ["RAM USAGE", (usedMem / totalMem * 100).toFixed(1) + "%"],
          ["SYS UPTIME", formatUptime(uptime)],
          ["CPU LOAD", os.loadavg()[0].toFixed(2)],
          ["TOTAL RAM", totalMem.toFixed(1) + " GB"]
        ];
      };

      const neonColors = ["#00ffcc", "#ff55ff", "#ffaa00", "#55aaff", "#ff3355", "#00ffaa"];

      const drawHex = (x, y, r, label, value, color) => {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = Math.PI / 3 * i;
          const x_i = x + r * Math.cos(angle);
          const y_i = y + r * Math.sin(angle);
          i === 0 ? ctx.moveTo(x_i, y_i) : ctx.lineTo(x_i, y_i);
        }
        ctx.closePath();
        ctx.strokeStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 15;
        ctx.lineWidth = 4;
        ctx.stroke();

        ctx.shadowBlur = 0;
        ctx.fillStyle = "#ffffff";
        ctx.font = "16px Arial";
        ctx.textAlign = "center";
        ctx.fillText(label, x, y - 10);
        ctx.font = "bold 20px Arial";
        ctx.fillText(value, x, y + 20);
      };

      const cx = width / 2;
      const cy = height / 2;
      const spacing = 180;

      // Fixed positions
      const positions = [
        [cx, cy - spacing],
        [cx + spacing, cy - spacing / 2],
        [cx + spacing, cy + spacing / 2],
        [cx, cy + spacing],
        [cx - spacing, cy + spacing / 2],
        [cx - spacing, cy - spacing / 2],
        [cx, cy]
      ];

      for (let frame = 0; frame < 30; frame++) {
        const stats = getSystemStats();
        ctx.clearRect(0, 0, width, height);

        // Background gradient
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, "#0f0f1b");
        gradient.addColorStop(1, "#1a1a2e");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Title
        ctx.fillStyle = "#00ffcc";
        ctx.font = "bold 36px Arial";
        ctx.textAlign = "center";
        ctx.shadowColor = "#00ffcc";
        ctx.shadowBlur = 20;
        ctx.fillText("YOUR POOKIEE BOT PANEL", width / 2, 70);
        ctx.shadowBlur = 0;

        // Datetime & OS
        ctx.font = "16px Arial";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "right";
        ctx.fillText(moment().tz("Asia/Dhaka").format("DD/MM/YYYY HH:mm:ss"), width - 30, 40);
        ctx.textAlign = "left";
        ctx.fillText(`OS: ${os.platform()} (x64)`, 30, 40);

        // Draw hexagons in fixed position, only border color changes per frame
        for (let i = 0; i < stats.length; i++) {
          const color = neonColors[(frame + i) % neonColors.length];
          drawHex(positions[i][0], positions[i][1], 90, stats[i][0], stats[i][1], color);
        }

        encoder.addFrame(ctx);
      }

      encoder.finish();

      stream.on("finish", () => {
        api.sendMessage({
          body: "",
          attachment: fs.createReadStream(filePath)
        }, event.threadID, () => fs.unlinkSync(filePath));
      });

    } catch (err) {
      console.error(err);
      api.sendMessage("❌ An error occurred while generating the dashboard.", event.threadID);
    }
  }
};
