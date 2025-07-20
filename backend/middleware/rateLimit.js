// middleware/rateLimit.js

import rateLimit from "express-rate-limit";

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === "production" ? 100 : 1000,
  message: { error: "Too many requests, please try again later." },
});

export default rateLimiter;
