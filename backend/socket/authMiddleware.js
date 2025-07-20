// socket/authMiddleware.js

import jwt from "jsonwebtoken";

export const socketAuthMiddleware = (socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) {
    return next(new Error("Authentication token missing"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Add the user data to socket
    socket.user = decoded;
    return next();
  } catch (error) {
    return next(new Error("Invalid or expired token"));
  }
};
