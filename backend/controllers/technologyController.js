import {
  getAllTechnologies,
  createTechnology,
  updateTechnology,
  deleteTechnology,
} from "../models/Technology.js";

// Get all
export const fetchTechnologies = async (req, res) => {
  try {
    const techs = await getAllTechnologies();
    res.json({ success: true, data: techs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Add
export const addTechnology = async (req, res) => {
  try {
    const { name } = req.body;
    const id = await createTechnology(name);
    res.status(201).json({ success: true, id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Update
export const editTechnology = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    await updateTechnology(id, name);
    res.json({ success: true, message: "Updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Delete
export const removeTechnology = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteTechnology(id);
    res.json({ success: true, message: "Deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
