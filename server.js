const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const path = require("path");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static("public"));

wss.on("connection", (ws) => {
  console.log("User connected");

  ws.on("message", (data) => {
    // Broadcast to everyone except sender
    wss.clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  });

  ws.on("close", () => {
    console.log("User disconnected");
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log("Server running");
});
