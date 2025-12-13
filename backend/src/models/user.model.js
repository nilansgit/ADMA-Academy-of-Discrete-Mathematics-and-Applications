import { pool } from '../config/db.js';

export const getUsers = async () => {
  const [rows] = await pool.query('SELECT * FROM users');
  return rows;
}
