import { pool } from "../config/db.js";
import { FORM_STATUS } from "../constants/formStatus.js";

export const secretaryApprove = async (uuid) => {
    const query = `UPDATE membership_forms SET status=? WHERE uuid=? AND status=?`;
    await pool.query(query, [FORM_STATUS.APPROVED, uuid, FORM_STATUS.FORWARDED_TO_SECRETARY]);
}

export const secretaryReject = async (uuid, reason) => {
    const query = `UPDATE membership_forms SET status=?, rejection_reason=? WHERE uuid=? AND status=?`;
    await pool.query(query, [FORM_STATUS.SECRETARY_REJECTED, reason, uuid, FORM_STATUS.FORWARDED_TO_SECRETARY]);
}

export const getCounts = async () => {
    const query = `SELECT
    SUM(status = 'FORWARDED_TO_SECRETARY') AS pending,
    SUM(status = 'APPROVED') AS approved,
    SUM(status = 'SECRETARY_REJECTED') AS rejected
    FROM membership_forms;
    `;

    const [rows] = await pool.query(query, []);
    return rows;
}

export const getAllForms = async (statuses) => {
    const query = `SELECT uuid,status, data->> '$.name' AS name, data->> '$.affiliation' AS affiliation,
                    data->> '$.paymentReference' AS paymentReference, data->> '$.membershipType.fee' AS Amount,
                    data->> '$.membershipType.title' AS membershipType, data->> '$.notes' AS note,
                    updated_at AS Submitted FROM membership_forms WHERE STATUS IN (?)`
    const res = await pool.query(query, [statuses.status]);
    return res;
}

export const getFormDetails = async (uuid, status) => {
    console.log(status.status, uuid)
    const query = `SELECT * FROM membership_forms WHERE uuid = ? AND status = ?`;
    const res = await pool.query(query, [uuid, status]);
    return res[0];
}