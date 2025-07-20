import express from "express";
import {
  updateProfile,
  getUserProfile,
  deleteUserProfile,
} from "../controllers/userProfileController.js";
import protect from "../middleware/authMiddleware.js";

const profileRouter = express.Router();

profileRouter.get("/", protect, getUserProfile);
profileRouter.put("/", protect, updateProfile);
profileRouter.delete("/", protect, deleteUserProfile);

export default profileRouter;
