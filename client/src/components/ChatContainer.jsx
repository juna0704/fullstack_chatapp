// ChatContainer.jsx

import React, { useEffect, useRef } from "react";
import assets, { messagesDummyData } from "../assets/assets";

const ChatContainer = ({ selectedUser, setSelectedUser }) => {
  const scrollEnd = useRef(null);

  useEffect(() => {
    scrollEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedUser]);

  const EmptyChatPlaceholder = () => (
    <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 h-full w-full max-md:hidden">
      <img src={assets.logo_icon} className="max-w-16" alt="Logo" />
      <p className="text-lg font-medium text-white">Chat anytime, anywhere</p>
    </div>
  );

  // In ChatContainer:
  if (!selectedUser) return <EmptyChatPlaceholder />;

  const currentUserId = "680f50e4f10f3cd28382ecf9";

  return (
    <>
      <div className="h-full overflow-scroll relative backdrop-blur-lg">
        {/* Header */}
        <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
          <img
            src={assets.profile_martin}
            alt={selectedUser?.fullName || "User"}
            className="w-8 rounded-full"
          />
          <p className="flex-1 text-lg text-white flex items-center gap-2">
            {selectedUser?.fullName || "Martin Johnson"}
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
          </p>
          <img
            onClick={() => setSelectedUser(null)}
            src={assets.arrow_icon}
            alt="Back"
            className="md:hidden max-w-7 cursor-pointer"
          />
          <img
            src={assets.help_icon}
            alt="Help"
            className="max-md:hidden max-w-5"
          />
        </div>

        {/* Chat Messages */}
        <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">
          {messagesDummyData.map((msg, index) => {
            const isCurrentUser = msg.senderId === currentUserId;

            return (
              <div
                key={index}
                className={`flex items-end gap-2 justify-end ${
                  !isCurrentUser ? "flex-row-reverse" : ""
                }`}
              >
                <div>
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="message"
                      className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-2"
                    />
                  )}
                  {msg.text && (
                    <p
                      className={`p-2 max-w-[250px] md:text-sm font-light rounded-lg break-all bg-violet-500/30 text-white mb-2 ${
                        isCurrentUser ? "rounded-br-none" : "rounded-bl-none"
                      }`}
                    >
                      {msg.text}
                    </p>
                  )}
                  <div className="text-center text-xs">
                    <img
                      src={
                        isCurrentUser
                          ? assets.avatar_icon
                          : assets.profile_martin
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
        <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3">
          <div className="flex-1 flex items-center bg-gray-100/12 px-3 rounded-full">
            <input
              type="text"
              placeholder="Send a message"
              className="flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400"
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
                alt="Gallery"
                className="w-5 mr-2 cursor-pointer"
              />
            </label>
          </div>
          <img
            src={assets.send_button}
            alt="Send"
            className="w-7 cursor-pointer"
          />
        </div>
      </div>
    </>
  );
};

export default ChatContainer;
