import express from "express";
import {
  createMessageController,
  getAllMessagesController,
} from "../controllers/messageController.js";

const router = express.Router();

// GET /api/messages
router.get("/messages", getAllMessagesController);
// POST /api/messages
router.post("/messages", createMessageController);

export default router;
