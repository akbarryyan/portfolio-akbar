import express from "express";
import {
  fetchTechnologies,
  addTechnology,
  editTechnology,
  removeTechnology,
} from "../controllers/technologyController.js";

const router = express.Router();

router.get("/technologies", fetchTechnologies);
router.post("/technologies", addTechnology);
router.put("/technologies/:id", editTechnology);
router.delete("/technologies/:id", removeTechnology);

export default router;
