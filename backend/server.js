// server.js

import http from "http";
import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";
import { initSocket } from "./socket/socket.js";
import { Server } from "socket.io";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 4000;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

initSocket(io);

// Connect to database
connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  });

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("SIGINT received. Shutting down...");
  server.close(() => {
    process.exit(0);
  });
});
