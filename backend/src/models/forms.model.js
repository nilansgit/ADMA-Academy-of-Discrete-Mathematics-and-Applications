import { pool } from '../config/db.js';

export const createForm = async(uuid) => {
  const query = `INSERT INTO membership_forms(uuid) VALUES (?)`;

  await pool.query(query,[uuid]);
};

export const checkStatus = async(uuid) => {
  const query = `SELECT status FROM membership_forms WHERE uuid = ?`;
  const [rows] = await pool.query(query,[uuid]);
  return rows;
}


export const getFormByUUID = async (uuid) => {
  const query = `
    SELECT * FROM membership_forms
    WHERE uuid = ?
  `;

  const [rows] = await pool.query(query, [uuid]);
  return rows[0]; // undefined if not found
};


export const saveDraft = async(uuid,data,currentStep,email) => {
  const query = `UPDATE membership_forms
    SET data = ?, current_step = ?, email = ?
    WHERE uuid = ? AND status = 'DRAFT'`
  await pool.query(query,
    [
      JSON.stringify(data),
      currentStep ?? 1,
      email ?? null,
      uuid
    ]
  );
}

export const submitForm = async(uuid) => {
  const query = `UPDATE membership_forms set status= 'FORWARDED_TO_TREASURER' WHERE uuid = ?`;
  await pool.query(query,[uuid]);
};


export const getFile = async(uuid) => {
  const query = `SELECT data->>'$.paymentReceipt' AS receipt, data->>'$.passportPhoto' AS pp FROM
                membership_forms WHERE uuid  = ?`
  const rows = await pool.query(query,[uuid]);
  return rows;
}


export const uploadFile = async(uuid,receipt_path, pp_path) => {
  const query = `UPDATE membership_forms
    SET data = JSON_SET(
    COALESCE(data, JSON_OBJECT()),
    '$.passportPhoto', ?,
    '$.paymentReceipt', ?
    )
    WHERE uuid = ?;
  `

  const result = await pool.query(query,[pp_path, receipt_path, uuid]);


  if (result[0].affectedRows) {
    const [updatedFile] =  await getFile(uuid);
    return updatedFile;
  }else{
    return "file not uploaded"
  }
}