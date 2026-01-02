import { pool } from "../config/db.js";
import { FORM_STATUS } from "../constants/formStatus.js";

export const secretaryApprove = async(uuid) => {
    const query = `UPDATE membership_forms SET status=? WHERE uuid=? AND status=?`;
    await pool.query(query,[FORM_STATUS.APPROVED,uuid,FORM_STATUS.FORWARDED_TO_SECRETARY]);
}


export const secretaryReject = async(uuid, reason) => {
    const query = `UPDATE membership_forms SET status=?, rejection_reason=? WHERE uuid=? AND status=?`;
    await pool.query(query,[FORM_STATUS.SECRETARY_REJECTED, reason, uuid, FORM_STATUS.FORWARDED_TO_SECRETARY ]);
}
