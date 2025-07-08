import express from "express";
import { createMessageController } from "../controllers/messageController.js";

const router = express.Router();

// POST /api/messages
router.post("/messages", createMessageController);

export default router;
