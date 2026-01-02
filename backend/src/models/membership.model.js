import { pool } from "../config/db.js";


export const getPhoto = async(uuid) => {
    const query = `SELECT data->>'$.passportPhoto' AS passportPhoto from membership_forms where uuid=?`;
    const result =  await pool.query(query,[uuid]);

    return result;
}


export const getReceipt = async(uuid) => {
    const query = `SELECT data->>'$.paymentReceipt' AS paymentReceipt from membership_forms where uuid=?`;
    const result =  await pool.query(query,[uuid]);

    return result;
}