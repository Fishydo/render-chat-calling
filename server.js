const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3000;

/* =========================
   BASIC HTTP ROUTES
========================= */

// Health check (Render needs this)
app.get("/", (req, res) => {
  res.send("WebRTC Signaling Server Running");
});

// Optional keep-alive endpoint
app.get("/ping", (req, res) => {
  res.send("pong");
});

/* =========================
   WEBSOCKET SIGNALING
========================= */

wss.on("connection", (ws) => {
  console.log("🔌 Client connected");

  ws.on("message", (message) => {
    let data;

    // Only accept valid JSON
    try {
      data = JSON.parse(message);
    } catch {
      console.log("⚠️ Ignored non-JSON message");
      return;
    }

    // Broadcast message to all OTHER clients
    wss.clients.forEach((client) => {
      if (
        client !== ws &&
        client.readyState === WebSocket.OPEN
      ) {
        client.send(JSON.stringify(data));
      }
    });
  });

  ws.on("close", () => {
    console.log("❌ Client disconnected");
  });

  ws.on("error", (err) => {
    console.log("WebSocket error:", err.message);
  });
});

/* =========================
   START SERVER
========================= */

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
