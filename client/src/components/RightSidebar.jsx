import React from "react";
import assets, { imagesDummyData } from "../assets/assets";

const RightSidebar = ({ selectedUser }) => {
  if (!selectedUser) return null;

  return (
    <div className="bg-[#8185B2]/10 text-white w-full relative max-md:hidden h-full max-h-screen overflow-y-auto">
      {/* --- User Info --- */}
      <div className="pt-16 flex flex-col items-center gap-2 text-xs font-light">
        <img
          src={selectedUser?.profilePic || assets.avatar_icon}
          alt="User"
          className="w-20 aspect-[1/1] rounded-full object-cover"
        />
        <h1 className="px-10 text-xl font-medium mx-auto flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          {selectedUser?.fullName}
        </h1>
        <p className="px-10 mx-auto text-center">{selectedUser?.bio}</p>
      </div>

      <hr className="border-[#ffffff50] my-4" />

      {/* --- Media Section --- */}
      <div className="px-5 text-xs">
        <p className="font-medium">Media</p>
        <div className="mt-2 max-h-[200px] overflow-y-auto grid grid-cols-2 gap-4 opacity-90">
          {imagesDummyData.map((url, index) => (
            <div
              key={index}
              onClick={() => window.open(url, "_blank")}
              className="cursor-pointer rounded hover:opacity-90 transition"
            >
              <img
                src={url}
                alt={`media-${index}`}
                title={`View media ${index + 1}`}
                className="w-full h-auto object-cover rounded-md hover:scale-105 transition-transform"
              />
            </div>
          ))}
        </div>
      </div>

      {/* --- Action Button --- */}
      <button
        aria-label="Load more media"
        className="absolute bottom-5 left-1/2 transform -translate-x-1/2
        bg-gradient-to-r from-purple-400 to-violet-600 text-white border-none
        text-sm font-light py-2 px-6 rounded-full cursor-pointer hover:opacity-90"
        onClick={() => alert("Load more clicked!")} // Placeholder
      >
        Load More
      </button>
    </div>
  );
};

export default RightSidebar;
