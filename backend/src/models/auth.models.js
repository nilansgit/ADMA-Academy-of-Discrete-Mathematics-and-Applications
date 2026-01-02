import { pool } from "../config/db.js";

export const loginUser = async(email) => {
    const query = `SELECT * FROM users WHERE email=?`;
    const result = pool.query(query,[email]);

    return result;
}