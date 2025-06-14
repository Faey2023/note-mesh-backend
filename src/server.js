import mongoose from "mongoose";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import config from "./config/index.js";
import app from "./app.js";

dotenv.config();

// server from express
const server = http.createServer(app);

// initiate
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

// socket events
io.on("connection", (socket) => {
  // console.log("user connected:", socket.id);

  socket.on("join-room", (docId, user) => {
    socket.join(docId);
    socket.data.user = user;
    socket.data.docId = docId;
    // console.log("joined room:", docId, user);

    // active users
    const clients = Array.from(io.sockets.adapter.rooms.get(docId) || []);
    const activeUsers = clients
      .map((id) => io.sockets.sockets.get(id)?.data?.user)
      .filter(Boolean);

    io.to(docId).emit("active-users", activeUsers);
  });

  socket.on("send-changes", (docId, content) => {
    socket.to(docId).emit("receive-changes", content);
  });

  socket.on("disconnect", () => {
    const docId = socket.data.docId;
    if (!docId) return;

    const clients = Array.from(io.sockets.adapter.rooms.get(docId) || []);
    const activeUsers = clients
      .map((id) => io.sockets.sockets.get(id)?.data?.user)
      .filter(Boolean);

    io.to(docId).emit("active-users", activeUsers);
    // console.log("user disconnected:", socket.id);
  });
});

// connect db
async function main() {
  try {
    await mongoose.connect(config.mongouri);
    server.listen(config.port, () => {
      console.log(`Note Mesh Backend is running on port ${config.port}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
}

main();
