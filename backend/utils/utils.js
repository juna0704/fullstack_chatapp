import jwt from "jsonwebtoken";
import crypto from "crypto";

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Generate reset token
const generateResetToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

export { generateToken, generateResetToken };
