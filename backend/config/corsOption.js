// config/corsOptions.js

const whitelist = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:5173",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

export default corsOptions;
