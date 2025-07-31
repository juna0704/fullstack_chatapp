import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import RightSidebar from "../components/RightSidebar";

const HomePage = () => {
  const [selectedUser, setSelectedUser] = useState(null); // Better than false
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setHasMounted(true), 50);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      className={`w-full h-screen transition-all duration-500 ease-in-out ${
        selectedUser ? "p-0" : "sm:px-[15%] sm:py-[5%]"
      }`}
    >
      <div
        key={selectedUser ? "chat-mode" : "dashboard-mode"}
        className={`backdrop-blur-xl border-2 border-gray-600 ${
          selectedUser ? "rounded-none" : "rounded-2xl"
        } overflow-hidden h-full grid relative transition-all duration-500 ease-in-out ${
          selectedUser
            ? "grid-cols-1 md:grid-cols-[1fr_2fr_1fr]"
            : "grid-cols-1 md:grid-cols-2"
        } ${
          hasMounted
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <Sidebar
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
        <ChatContainer
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
        <RightSidebar selectedUser={selectedUser} />
      </div>
    </div>
  );
};

export default HomePage;
