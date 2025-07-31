import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

const ProfilePage = () => {
  const { authUser, updateProfile } = useContext(AuthContext);
  const [selectedImg, setSelectedImg] = useState(null);
  const [name, setName] = useState(authUser?.fullName || "");
  const [bio, setBio] = useState(authUser?.bio || "");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Helper to convert image file to Base64 string
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload a valid image.");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image must be less than 2MB.");
        return;
      }
      setSelectedImg(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let profilePicBase64 = null;

      if (selectedImg) {
        profilePicBase64 = await getBase64(selectedImg);
      }

      await updateProfile({
        fullName: name,
        bio,
        ...(profilePicBase64 && { profilePic: profilePicBase64 }),
      });

      toast.success("Profile updated successfully");
      navigate("/");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Profile update failed"
      );
    } finally {
      setLoading(false); // ✅ always reset loading state
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center">
      <div className="w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex flex-col rounded-lg p-10">
        <h3 className="text-lg mb-6">Profile Details</h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <label htmlFor="name" className="flex flex-col">
            Name
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-md p-2 mt-1 text-black"
              required
            />
          </label>

          <label htmlFor="bio" className="flex flex-col">
            Bio
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="rounded-md p-2 mt-1 text-black"
              rows={4}
            />
          </label>

          <label htmlFor="profile-pic" className="flex flex-col">
            Profile Image
            <input
              id="profile-pic"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1"
            />
            {(selectedImg || authUser?.profilePic) && (
              <img
                src={
                  selectedImg
                    ? URL.createObjectURL(selectedImg)
                    : authUser?.profilePic || "/default-avatar.png"
                }
                alt="Profile Preview"
                className="mt-2 h-24 w-24 rounded-full object-cover"
              />
            )}
          </label>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
