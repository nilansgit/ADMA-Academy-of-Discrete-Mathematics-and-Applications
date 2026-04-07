import { pool } from "../config/db.js";
import { FORM_STATUS } from "../constants/formStatus.js";
import { mapFormToMember } from "../constants/memberData.js";
import { getFormByUUID } from "./forms.model.js";

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
    const query = `SELECT uuid, application_number, status, data->> '$.name' AS name, data->> '$.affiliation' AS affiliation,
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


export const getMembershipNumberAndInsert = async (uuid) => {

    const form = await getFormByUUID(uuid);
    const memberData = form.data;
    const formId = form.id;

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();
        

        // membership number logic starts
        const year = new Date().getFullYear();


        await connection.query(
            `INSERT INTO membershipCounter (year, last_number)
            VALUES (?, LAST_INSERT_ID(1))
            ON DUPLICATE KEY UPDATE last_number = LAST_INSERT_ID(last_number + 1)`,
            [year]
        );

        const [rows] = await connection.query(
            `SELECT last_number FROM membershipCounter WHERE year = ?`,[year]
        )

        const lastNumber = rows[0].last_number;

        // generate membership number

        const seq = String(lastNumber).padStart(4,'0');
        const membershipNumber = `ADMA${year}${seq}`;
        // membership number logic ends

        //insert complete data into members table
        const member = mapFormToMember(memberData, membershipNumber, formId);

        const columns = Object.keys(member);
        const values = Object.values(member);

        const result  = await connection.query(
            `INSERT INTO members (${columns.join(", ")}) VALUES (${columns.map(() => "?").join(", ")})`,values
        )

        console.log(result);

        const query = `UPDATE membership_forms SET status=? WHERE uuid=? AND status=?`;
        await connection.query(query, [FORM_STATUS.APPROVED, uuid, FORM_STATUS.FORWARDED_TO_SECRETARY]);
        
        await connection.commit();
    }catch (err) {
        await connection.rollback();
        throw err;
    }finally {
        connection.release();
    }

}