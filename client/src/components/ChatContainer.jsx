import React, { useEffect, useRef, useContext, useState } from "react";
import assets from "../assets/assets";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";

const ChatContainer = ({ selectedUser, setSelectedUser }) => {
  const { messages } = useContext(ChatContext);
  const { authUser } = useContext(AuthContext);

  const scrollEnd = useRef(null);
  const [messageText, setMessageText] = useState("");

  // Scroll to bottom when messages update
  useEffect(() => {
    scrollEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    // Placeholder: Call your sendMessage function from context or props
    // sendMessage({ recipientId: selectedUser._id, text: messageText });
    setMessageText("");
  };

  if (!selectedUser) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 h-full w-full max-md:hidden">
        <img src={assets.logo_icon} className="max-w-16" alt="Logo" />
        <p className="text-lg font-medium text-white">Chat anytime, anywhere</p>
      </div>
    );
  }

  const currentUserId = authUser?._id;

  return (
    <div className="h-full overflow-hidden relative backdrop-blur-lg flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 py-3 px-4 border-b border-stone-500">
        <img
          src={assets.profile_martin}
          alt={selectedUser?.fullName}
          className="w-8 rounded-full"
        />
        <p className="flex-1 text-lg text-white flex items-center gap-2">
          {selectedUser?.fullName || "User"}
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
        </p>
        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          alt="Back"
          className="md:hidden max-w-7 cursor-pointer hover:rotate-180 transition-transform"
          title="Back"
        />
        <img
          src={assets.help_icon}
          alt="Help"
          className="max-md:hidden max-w-5 cursor-pointer"
        />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-scroll p-4 space-y-4">
        {messages.map((msg, index) => {
          const isCurrentUser = msg.senderId === currentUserId;

          return (
            <div
              key={msg._id || index}
              className={`flex ${
                isCurrentUser ? "justify-end" : "justify-start"
              }`}
            >
              <div>
                {msg.image && (
                  <img
                    src={msg.image}
                    alt="message"
                    className="max-w-[230px] border border-gray-700 rounded-lg mb-2"
                  />
                )}
                {msg.text && (
                  <p
                    className={`p-2 max-w-[250px] md:text-sm font-light rounded-lg break-words bg-violet-500/30 text-white ${
                      isCurrentUser ? "rounded-br-none" : "rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </p>
                )}
                <div className="text-center text-xs mt-1">
                  <img
                    src={
                      isCurrentUser ? assets.avatar_icon : assets.profile_martin
                    }
                    alt="avatar"
                    className="w-7 rounded-full mx-auto"
                  />
                  <p className="text-gray-500">{msg.createdAt}</p>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={scrollEnd}></div>
      </div>

      {/* Message Input */}
      <div className="p-3 border-t border-stone-500 bg-white/5 flex items-center gap-3">
        <div className="flex-1 flex items-center bg-gray-100/10 px-3 rounded-full">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Send a message"
            className="flex-1 text-sm p-3 bg-transparent border-none rounded-lg outline-none text-white placeholder-gray-400"
          />
          <input
            type="file"
            id="image"
            accept="image/png, image/jpeg"
            className="hidden"
          />
          <label htmlFor="image">
            <img
              src={assets.gallery_icon}
              alt="Upload"
              className="w-5 mr-2 cursor-pointer hover:opacity-80"
              title="Upload Image"
            />
          </label>
        </div>
        <img
          src={assets.send_button}
          alt="Send"
          onClick={handleSendMessage}
          className="w-7 cursor-pointer hover:opacity-80"
          title="Send"
        />
      </div>
    </div>
  );
};

export default ChatContainer;
