import { socketAuthMiddleware } from "./authMiddleware.js";

const userSocketMap = new Map(); // Map<userId, socketId>
let ioInstance;

export const initSocket = (io) => {
  ioInstance = io;
  io.use(socketAuthMiddleware);

  io.on("connection", (socket) => {
    const userId = socket.user?.id;

    if (!userId) {
      socket.disconnect();
      return;
    }

    console.log(`🔌 User connected: ${userId}`);
    userSocketMap.set(userId, socket.id);

    // Broadcast online users
    io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));

    socket.on("disconnect", () => {
      console.log(`⚡ User disconnected: ${userId}`);
      userSocketMap.delete(userId);
      io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));
    });
  });
};

// Export the map to access from controllers
export { userSocketMap, ioInstance as io };
