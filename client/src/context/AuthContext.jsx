import React, { useState, useEffect, createContext } from "react";
import axios from "../api/axios";
import { toast } from "react-toastify";
import { io } from "socket.io-client";

export const AuthContext = createContext();

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  // Function to connect socket and listen to online users
  const connectSocket = (userData) => {
    if (!userData || socket?.connected) return;

    if (socket) {
      socket.off("getOnlineUsers");
      socket.disconnect();
    }

    const newSocket = io(backendUrl, {
      query: { userId: userData._id },
    });

    newSocket.on("getOnlineUsers", (userIds) => {
      setOnlineUsers(userIds);
    });

    setSocket(newSocket);
  };

  // Function to check authentication status on mount or token change
  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/api/auth/check");
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  // Automatically set axios token header and checkAuth when token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["token"] = token;
      checkAuth();
    } else {
      // Clear axios header if token is removed
      delete axios.defaults.headers.common["token"];
      setAuthUser(null);
      setOnlineUsers([]);
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }
  }, [token]);

  // Login function example (simplified)
  const login = async (state, credentials) => {
    try {
      const { data } = await axios.post(`/api/auth/${state}`, credentials);
      if (data.success) {
        setAuthUser(data.userData);
        connectSocket(data.userData);
        axios.defaults.headers.common["token"] = data.token;
        setToken(data.token);
        localStorage.setItem("token", data.token);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  // Logout function example
  const logout = async () => {
    try {
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["token"];
      setToken(null);
      setAuthUser(null);
      setOnlineUsers([]);
      delete axios.defaults.headers.common["token"];

      if (socket) {
        socket.disconnect();
        setSocket(null);
      }

      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error.message || "Logout failed"
      );
    }
  };

  // Value object exposed by AuthContext.Provider
  const value = {
    axios,
    authUser,
    onlineUsers,
    socket,
    login,
    logout,
    setToken,
    setAuthUser,
    setOnlineUsers,
    setSocket,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
