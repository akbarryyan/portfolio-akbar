import express from "express";
import cors from "cors";
import messageRoutes from "./routes/messageRoutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", messageRoutes);

export default app;
