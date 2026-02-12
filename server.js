const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const https = require("https");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// ─────────────────────────────────────
// BASIC EXPRESS ROUTES
// ─────────────────────────────────────

app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

app.get("/ping", (req, res) => {
  res.status(200).send("alive");
});

// ─────────────────────────────────────
// WEBSOCKET SERVER
// ─────────────────────────────────────

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (message) => {
    console.log("Received:", message.toString());

    // Echo example (you can replace this with your voice logic)
    ws.send(`Server received: ${message}`);
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

// ─────────────────────────────────────
// AUTO SELF-PING (every 5 minutes)
// ─────────────────────────────────────

const SELF_URL = "https://chat-lcc.onrender.com";

setInterval(() => {
  https
    .get(SELF_URL, (res) => {
      console.log("Self ping status:", res.statusCode);
    })
    .on("error", (err) => {
      console.log("Ping failed:", err.message);
    });
}, 5 * 60 * 1000);

// ─────────────────────────────────────
// START SERVER
// ─────────────────────────────────────

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
