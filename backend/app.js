import express from "express";
import cors from "cors";
import messageRoutes from "./routes/messageRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import technologyRoutes from "./routes/technologyRoutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/uploads", express.static("uploads"));
app.use("/api", messageRoutes);
app.use("/api", projectRoutes);
app.use("/api", technologyRoutes);

export default app;
