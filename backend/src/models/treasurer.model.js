import { pool } from '../config/db.js';
import { FORM_STATUS } from '../constants/formStatus.js';

export const fwdToSec = async (uuid) => {
    const query = `UPDATE membership_forms SET status= ? WHERE uuid = ? AND status=?`;
    pool.query(query, [FORM_STATUS.FORWARDED_TO_SECRETARY, uuid, FORM_STATUS.FORWARDED_TO_TREASURER]);
}

export const treasurerReject = async (uuid, reason) => {
    const query = `UPDATE membership_forms SET status = ?, rejection_reason=? WHERE uuid=? AND STATUS=?`
    await pool.query(query, [FORM_STATUS.TREASURER_REJECTED, reason, uuid, FORM_STATUS.FORWARDED_TO_TREASURER]);
}

export const getCounts = async () => {
    const query = `SELECT
    SUM(status = 'FORWARDED_TO_TREASURER') AS pending_verification,
    SUM(status = 'FORWARDED_TO_SECRETARY') AS forwarded_to_secretary,
    SUM(status = 'TREASURER_REJECTED') AS rejected
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