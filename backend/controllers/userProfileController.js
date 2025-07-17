import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// get user profile
const getUserProfile = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select(
      "-password -resetPasswordToken -resetPasswordExpire -securityAnswer -emailVerificationToken -emailVerificationExpire"
    );

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

//delete user profile
const deleteUserProfile = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    await User.deleteOne({ _id: userId });

    res.status(200).json({
      success: true,
      message: "User account deleted successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Controller to update user profile details
const updateProfile = asyncHandler(async (req, res) => {
  try {
    const { profilePic, bio, name } = req.body;
    const userId = req.user._id;
    let updatedUser;

    let imageUrl;
    // console.log("Received profilePic:", profilePic);
    // console.log("Uploading to Cloudinary...");
    // console.log("profilePic type:", typeof profilePic);
    // console.log("profilePic length (if string):", profilePic?.length);

    if (profilePic) {
      // Upload user-provided image (base64 or URL)
      const upload = await cloudinary.uploader.upload(profilePic);
      imageUrl = upload.secure_url;
    } else {
      // Upload default image from assets folder
      const localImagePath = path.join(__dirname, "../assets/wall.jpg"); // Adjust path if needed
      const upload = await cloudinary.uploader.upload(localImagePath);
      imageUrl = upload.secure_url;
    }

    updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: imageUrl, bio, name },
      { new: true }
    );

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error in updateProfile:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong during profile update",
    });
  }
});

export { updateProfile, getUserProfile, deleteUserProfile };
