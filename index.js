import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { dbConnection } from "./src/configs/dbConnection.js";
import { errorHandler } from "./src/middlewares/errorHandler.js";
import apiRoutes from "./src/api.js";

const server = express();

// Middlewares
server.use(cors({
  origin: ["https://ajil-client.vercel.app","http://localhost:5173", true],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true, // if you need cookies/auth
}));

server.use(cookieParser());
server.use(helmet());
server.use(express.json());

// Routes
server.get("/", (req, res) => {
  res.send("Hello world!");
});

server.use("/api", apiRoutes);

// Global error handler
server.use(errorHandler);

// Connect to DB (Vercel runs cold starts, so ensure this is async safe)
dbConnection()

  // Start server for local testing
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "serverless") {
  server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

export default server;
