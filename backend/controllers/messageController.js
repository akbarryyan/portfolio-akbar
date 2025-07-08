import { createMessage } from "../models/Message.js";

export async function createMessageController(req, res) {
  try {
    const { name, email, phone, message } = req.body;
    await createMessage({ name, email, phone, message });
    res
      .status(201)
      .json({ success: true, message: "Message saved successfully!" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to save message",
      error: error.message,
    });
  }
}
