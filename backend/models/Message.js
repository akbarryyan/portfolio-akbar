import pool from "../config/db.js";

export async function createMessage({ name, email, phone, message }) {
  const [result] = await pool.execute(
    "INSERT INTO messages (name, email, phone, message, createdAt) VALUES (?, ?, ?, ?, NOW())",
    [name, email, phone, message]
  );
  return result;
}
