// src/utils/socket.js
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  query: { userId: localStorage.getItem("userId") },
});

export default socket;
