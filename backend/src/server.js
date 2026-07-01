import * as dns from "dns";
dns.setServers(["1.1.1.1", "8.8.8.8", "8.8.4.4"]);

import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";

import { connectDB } from "./lib/db.js";

const app = express();
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://bhashashikho0409.onrender.com"]
    : ["http://localhost:5173"];
const PORT = process.env.PORT || 5001;

const __dirname = path.resolve();

// middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

// connect DB FIRST
//connectDB();


// serve frontend (ONLY ONCE)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}
app.get("/", (req, res) => {
  res.send("Backend working 🚀");
});

const startServer = async () => {
  try {
    await connectDB(); // DB FIRST
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.log("Server start error:", err);
  }
};

startServer();