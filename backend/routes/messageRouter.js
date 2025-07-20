import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getUserForSidebar,
  markMessageAsSeen,
  getMessages,
} from "../controllers/messageController.js";

const messageRouter = express.Router();

messageRouter.get("/users", protect, getUserForSidebar);
messageRouter.get("/:id", protect, getMessages);
messageRouter.get("mark/:id", protect, markMessageAsSeen);

export default messageRouter;
