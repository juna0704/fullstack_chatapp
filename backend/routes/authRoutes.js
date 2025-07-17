import express from "express";
import {
  checkAuth,
  loginUser,
  registerUser,
  forgotPassword,
  resetPassword,
  verifyResetToken,
} from "../controllers/userAuthController.js";

const authRouter = express.Router();

authRouter.get("/check-auth", checkAuth);
authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password", resetPassword);
authRouter.post("/verify-reset-token", verifyResetToken);

export default authRouter;
