import React, { useContext, useEffect, useState } from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, unseenMessages } =
    useContext(ChatContext);

  const { logout, onlineUsers } = useContext(AuthContext);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      await getUsers(); // Make sure getUsers updates context properly
      setLoading(false);
    };
    fetchUsers();
  }, []);

  // Sort users: online first
  const sortedUsers = users
    .filter((user) => user.fullName.toLowerCase().includes(input.toLowerCase()))
    .sort((a, b) => {
      const aOnline = onlineUsers.includes(a._id);
      const bOnline = onlineUsers.includes(b._id);
      return aOnline === bOnline ? 0 : aOnline ? -1 : 1;
    });

  return (
    <div
      className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-auto text-white ${
        selectedUser ? "max-md:hidden" : ""
      }`}
    >
      {/* Logo */}
      <div className="flex justify-between items-center">
        <img
          src={assets.logo}
          alt="Chat App Logo"
          className="max-w-40"
          title="Chat App"
        />
      </div>

      {/* Search */}
      <div className="bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-4">
        <img src={assets.search_icon} alt="Search" className="w-3" />
        <input
          type="text"
          placeholder="Search User..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="bg-transparent border-none outline-none text-white text-xs placeholder-white/70 flex-1"
          aria-label="Search User"
        />
      </div>

      {/* Users List */}
      <div className="mt-6">
        {loading ? (
          <p className="text-sm text-gray-300">Loading users...</p>
        ) : sortedUsers.length > 0 ? (
          <ul>
            {sortedUsers.map((user) => (
              <li
                key={user._id}
                tabIndex={0}
                onClick={() => setSelectedUser(user)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setSelectedUser(user);
                }}
                className={`cursor-pointer py-2 px-3 rounded-md mb-2 outline-none ${
                  selectedUser?._id === user._id
                    ? "bg-violet-600"
                    : "hover:bg-violet-400/40"
                }`}
                title={`Chat with ${user.fullName}`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={user.profilePic || assets.logo_icon}
                      alt={user.fullName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    {onlineUsers.includes(user._id) && (
                      <span
                        className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"
                        title="Online"
                      ></span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{user.fullName}</span>
                    {unseenMessages[user._id] > 0 && (
                      <span className="text-sm text-yellow-400">
                        {unseenMessages[user._id]} new
                      </span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-300">No users found</p>
        )}
      </div>

      {/* Logout */}
      <button
        onClick={() => {
          logout();
          navigate("/login");
        }}
        className="mt-8 w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition"
        aria-label="Logout"
      >
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
