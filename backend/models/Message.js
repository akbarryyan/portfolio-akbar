import pool from "../config/db.js";

export async function createMessage({ name, email, message }) {
  const [result] = await pool.execute(
    "INSERT INTO messages (name, email, message, createdAt) VALUES (?, ?, ?, NOW())",
    [name, email, message]
  );
  return result;
}
