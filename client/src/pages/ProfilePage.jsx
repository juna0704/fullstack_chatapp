import React, { useState } from "react";
import assets from "../assets/assets";

const ProfilePage = () => {
  const [fullName, setFullName] = useState("Martin Johnson");
  const [bio, setBio] = useState("I'm a passionate developer.");
  const [profilePic, setProfilePic] = useState(assets.avatar_icon);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setProfilePic(imageURL);
    }
  };

  const handleSave = () => {
    // 🔐 TODO: Send data to backend or update local storage
    alert("Profile updated!");
  };

  return (
    <div className="flex justify-center items-center h-screen text-white bg-black/90">
      <div className="bg-[#282142] p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

        <div className="flex flex-col items-center gap-4">
          <img
            src={profilePic}
            alt="Profile"
            className="w-24 h-24 rounded-full"
          />
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </div>

        <div className="mt-4 flex flex-col gap-3">
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="p-2 rounded bg-[#1e1e2f] text-white outline-none"
            placeholder="Full Name"
          />
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="p-2 rounded bg-[#1e1e2f] text-white outline-none"
            placeholder="Bio"
          />
        </div>

        <button
          onClick={handleSave}
          className="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
