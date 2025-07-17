import express from "express";
import {
  checkAuth,
  loginUser,
  registerUser,
  updateProfile,
  forgotPassword,
  resetPassword,
  verifyResetToken,
} from "../controllers/userController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes (no authentication required)
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/verify-reset-token", verifyResetToken);

// Protected routes (authentication required)
router.put("/update-profile", protect, updateProfile); // FIXED: Changed POST to PUT (more RESTful)
router.get("/check", protect, checkAuth); // FIXED: Changed POST to GET (more appropriate)

//More RESTful router structure
//router.get("/profile", protect, getUserProfile); // Get user profile
//router.delete("/profile", protect, deleteUserProfile); // Delete user account
router.patch("/profile", protect, updateProfile); // Partial update (alternative to PUT)

export default router;

// ADDITIONAL: Example of how to structure routes in separate files
/*
// auth.js
const authRouter = express.Router();
authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password", resetPassword);
authRouter.post("/verify-reset-token", verifyResetToken);

// profile.js  
const profileRouter = express.Router();
profileRouter.get("/", protect, getUserProfile);
profileRouter.put("/", protect, updateProfile);
profileRouter.delete("/", protect, deleteUserProfile);

// In main app.js
app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);
*/
