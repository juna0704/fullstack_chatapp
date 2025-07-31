import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "./AuthContext";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});

  const { socket, axios } = useContext(AuthContext);

  const handleNewMessage = async (newMessage) => {
    try {
      if (!newMessage || !newMessage.senderId) return;

      if (selectedUser && newMessage.senderId === selectedUser._id) {
        newMessage.seen = true;

        setMessages((prev) =>
          [...prev, newMessage].sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          )
        );

        await axios.put(`/api/messages/mark/${newMessage._id}`);

        setUnseenMessages((prev) => {
          const updated = { ...prev };
          delete updated[newMessage.senderId];
          return updated;
        });
      } else {
        setUnseenMessages((prev) => ({
          ...prev,
          [newMessage.senderId]: prev[newMessage.senderId]
            ? prev[newMessage.senderId] + 1
            : 1,
        }));
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Failed to mark message as seen"
      );
    }
  };

  const subscribeToMessages = () => {
    if (!socket) return;
    socket.on("newMessage", handleNewMessage);
  };

  const unsubscribeFromMessages = () => {
    if (socket) socket.off("newMessage", handleNewMessage);
  };

  useEffect(() => {
    subscribeToMessages();
    return () => {
      unsubscribeFromMessages();
    };
  }, [socket, selectedUser]);

  const value = {
    messages,
    setMessages,
    users,
    setUsers,
    selectedUser,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
