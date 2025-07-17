// middleware/protect.js
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        res.status(401);
        throw new Error("Not authorized, user no longer exists");
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

export default protect;

export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403);
    throw new Error("Not authorized as an admin");
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401);
      throw new Error("Not authorized, please login");
    }

    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(
        `User role ${req.user.role} is not authorized to access this route`
      );
    }

    next();
  };
};

export const verifyUser = (req, res, next) => {
  if (req.user && req.user.isVerified) {
    next();
  } else {
    res.status(403);
    throw new Error("Please verify your email to access this resource");
  }
};

export const checkActiveUser = (req, res, next) => {
  if (req.user && req.user.isActive !== false) {
    next();
  } else {
    res.status(403);
    throw new Error("Account is deactivated, please contact support");
  }
};
