import React from "react";
import { useNavigate } from "react-router-dom";
import assets, { userDummyData } from "../assets/assets";

const Sidebar = ({ selectedUser, setSelectedUser }) => {
  const navigate = useNavigate();

  return (
    <div
      className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${
        selectedUser ? "max-md:hidden" : ""
      }`}
    >
      {/* Header */}
      <div className="pb-5 relative">
        <div className="flex justify-between items-center">
          <img src={assets.logo} alt="Logo" className="max-w-40" />
          <div className="relative py-2 group">
            <img
              src={assets.menu_icon}
              alt="Menu"
              className="max-h-5 cursor-pointer"
            />
            {/* Dropdown menu now inside group */}
            <div className="absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border border-gray-500 text-gray-100 hidden group-hover:block">
              <p
                onClick={() => navigate("/profile")}
                className="cursor-pointer text-sm"
              >
                Edit Profile
              </p>
              <hr className="my-2 border-t border-gray-500" />
              <p className="cursor-pointer text-sm">Logout</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5">
        <img src={assets.search_icon} alt="Search" className="w-3" />
        <input
          type="text"
          className="bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1"
          placeholder="Search User..."
        />
      </div>

      {/* User List */}
      <div className="flex flex-col mt-5 gap-4">
        {userDummyData.map((user, index) => (
          <div
            key={index}
            className="flex items-center gap-3 cursor-pointer hover:bg-[#282142] p-2 rounded"
            onClick={() => setSelectedUser(user)}
          >
            <img
              src={user?.profilePic || assets.avatar_icon}
              alt={user?.fullName}
              className="w-[35px] aspect-[1/1] rounded-full"
            />

            <div className="flex flex-col leading-5">
              <p className="text-sm font-medium">{user.fullName}</p>
              <span
                className={`text-xs ${
                  index < 3 ? "text-green-400" : "text-neutral-400"
                }`}
              >
                {index < 3 ? "Online" : "Offline"}
              </span>
            </div>

            {index > 2 && (
              <p className="ml-auto text-gray-400 text-xs">{index}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
