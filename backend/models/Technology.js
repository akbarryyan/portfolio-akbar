import pool from "../config/db.js";

// Get all technologies
export const getAllTechnologies = async () => {
  const [rows] = await pool.query("SELECT * FROM technologies");
  return rows;
};

// Create new technology
export const createTechnology = async (name) => {
  const [result] = await pool.query(
    "INSERT INTO technologies (name) VALUES (?)",
    [name]
  );
  return result.insertId;
};

// Update technology
export const updateTechnology = async (id, name) => {
  await pool.query("UPDATE technologies SET name = ? WHERE id = ?", [name, id]);
};

// Delete technology
export const deleteTechnology = async (id) => {
  await pool.query("DELETE FROM technologies WHERE id = ?", [id]);
};
