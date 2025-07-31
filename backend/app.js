// app.js

import express from "express";
import helmet from "helmet";
import compression from "compression";
import rateLimiter from "./middleware/rateLimit.js";
import cors from "cors";
import corsOptions from "./config/corsOption.js";
import logging from "./middleware/logging.js";
import errorHandler from "./middleware/errorHandler.js";

// App routes
import authRouter from "./routes/authRoutes.js";
import profileRouter from "./routes/profileRoutes.js";
import messageRouter from "./routes/messageRouter.js";

const app = express();

// Base Middleware
app.use(cors(corsOptions));
app.use(helmet());
app.use(compression());
app.use(rateLimiter);
app.use(logging);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health Check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", uptime: process.uptime() });
});

// Express (Node.js) example
app.get("/api/ping", (req, res) => {
  res.json({ message: "pong" });
});

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/profiles", profileRouter);
app.use("/api/messages", messageRouter);

// Error Handling
app.use(errorHandler);

export default app;
