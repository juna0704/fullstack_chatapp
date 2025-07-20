import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Message from "../models/messageModel.js";
import cloudinary from "../config/cloudinary.js";
import { userSocketMap } from "../socket/socket.js";
import { io } from "../socket/socket.js";

// Get all users except the logged-in user, and their unseen messages count
const getUserForSidebar = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    // Find all users except the requester
    const filteredUsers = await User.find({ _id: { $ne: userId } }).select(
      "-password"
    );

    // Aggregate unseen message counts grouped by senderId
    const unseenMessagesArray = await Message.aggregate([
      {
        $match: {
          receiverId: new mongoose.Types.ObjectId(userId),
          seen: false,
        },
      },
      {
        $group: {
          _id: "$senderId",
          count: { $sum: 1 },
        },
      },
    ]);

    // Convert array to object map
    const unseenMessages = unseenMessagesArray.reduce((acc, curr) => {
      acc[curr._id.toString()] = curr.count;
      return acc;
    }, {});

    res.json({
      success: true,
      users: filteredUsers,
      unseenMessages,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get chat messages between current user and selected user
const getMessages = asyncHandler(async (req, res) => {
  try {
    const { id: selectedUserId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 }); //

    await Message.updateMany(
      { senderId: selectedUserId, receiverId: myId },
      { seen: true }
    );

    res.json({ success: true, messages });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
});

// Mark a specific message as seen
const markMessageAsSeen = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndUpdate(id, { seen: true });
    res.json({ success: true });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
});

// Send a message with optional image upload
const sendMessage = asyncHandler(async (req, res) => {
  try {
    const { text, image } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.json({ success: true, newMessage });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
});

export { getUserForSidebar, markMessageAsSeen, getMessages, sendMessage };
