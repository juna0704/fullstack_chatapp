import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { generateToken, generateResetToken } from "../utils/utils.js";
import cloudinary from "../config/cloudinary.js";

//@desc this is register route
//@route POST /api/v1/users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, bio, securityAnswer } = req.body;

  try {
    const missingFields = {};
    if (!name) missingFields.name = null;
    if (!email) missingFields.email = null;
    if (!password) missingFields.password = null;
    if (!bio) missingFields.bio = null;
    if (!securityAnswer) missingFields.securityAnswer = null;

    if (Object.keys(missingFields).length > 0) {
      return res.status(400).json({
        message: "All fields are required",
        missingFields,
      });
    }

    // Check if user already exists
    const userExist = await User.findOne({ email });
    if (userExist) {
      res.status(400);
      throw new Error("User already exists");
    }

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      bio,
      securityAnswer: securityAnswer.trim(),
    });

    //Response with user and token
    if (user) {
      res.status(201).json({
        id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  } catch (error) {
    console.error(error);
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      message: error.message || "Server error during registration",
    });
  }
});

//@desc this is login route
//@route POST /api/v1/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  try {
    //find user
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400);
      throw new Error("Invalid credentials");
    }

    //compare password
    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      res.status(400);
      throw new Error("Invalid Credentials");
    }

    //response with user and token
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
      message: "Login successful",
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
});

//@desc Forgot password - send reset token
//@route POST /api/users/forgot-password
//@access public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email, phone } = req.body;
  const emailOrPhone = email || phone;

  console.log("Received:", emailOrPhone);

  if (!emailOrPhone) {
    res.status(400);
    throw new Error("Please enter your email or mobile number");
  }

  // Find user by email or phone
  const user = await User.findOne({
    $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
  });

  if (!user) {
    res.status(404);
    throw new Error("User not found with this email or phone number");
  }

  // Generate reset token
  const resetToken = generateResetToken();
  const resetTokenExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Save reset token to user
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpire = resetTokenExpire;
  await user.save();

  res.status(200).json({
    message: "Password reset instructions sent successfully",
    resetToken: resetToken,
    securityQuestion: user.securityQuestion,
  });
});

//@desc Reset password using token and security question
//@route POST /api/users/reset-password
//@access public
const resetPassword = asyncHandler(async (req, res) => {
  const { resetToken, newPassword, securityAnswer } = req.body;

  if (!resetToken || !newPassword || !securityAnswer) {
    res.status(400);
    throw new Error("All fields are required");
  }

  // Find user by reset token
  const user = await User.findOne({
    resetPasswordToken: resetToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired reset token");
  }

  // Safely compare securityAnswer
  const storedAnswer = user.securityAnswer?.toLowerCase().trim();
  const submittedAnswer = securityAnswer?.toLowerCase().trim();

  console.log("Stored Answer:", `"${storedAnswer}"`);
  console.log("Submitted Answer:", `"${submittedAnswer}"`);

  if (!storedAnswer || storedAnswer !== submittedAnswer) {
    res.status(400);
    throw new Error("Security answer does not match");
  }

  // Hash new password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  // Update password and clear reset token
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json({
    message: "Password reset successfully",
  });
});

//@desc Verify reset token and get security question
//@route POST /api/users/verify-reset-token
//@access public
const verifyResetToken = asyncHandler(async (req, res) => {
  const { resetToken } = req.body;

  if (!resetToken) {
    res.status(400);
    throw new Error("Reset token is required");
  }

  // Find user by reset token
  const user = await User.findOne({
    resetPasswordToken: resetToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired reset token");
  }

  res.status(200).json({
    message: "Token is valid",
    securityQuestion: user.securityQuestion,
  });
});

//Controller to check if user is authenticated
const checkAuth = (req, res) => {
  res.json({ success: true, user: req.user });
};

export {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  verifyResetToken,
  checkAuth,
};
