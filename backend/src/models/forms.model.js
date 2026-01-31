import { pool } from '../config/db.js';
import { FORM_STATUS } from '../constants/formStatus.js';

export const createForm = async(uuid) => {
  const query = `INSERT INTO membership_forms(uuid) VALUES (?)`;

  await pool.query(query,[uuid]);
};

export const checkStatus = async(uuid) => {
  const query = `SELECT status, id FROM membership_forms WHERE uuid = ?`;
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
    WHERE uuid = ?`
  await pool.query(query,
    [
      JSON.stringify(data),
      currentStep ?? 1,
      email ?? null,
      uuid
    ]
  );
}

export const submitForm = async(uuid,currentStatus,id) => {
  let setStatus = FORM_STATUS.FORWARDED_TO_TREASURER;
  if(currentStatus === FORM_STATUS.SECRETARY_REJECTED){
    setStatus = FORM_STATUS.FORWARDED_TO_SECRETARY;
  }

  if (currentStatus === FORM_STATUS.DRAFT){
    const year = new Date().getFullYear();
    const applicationNumber = `ADMA-${year}-${String(id).padStart(6, '0')}`;
    const query = `UPDATE membership_forms set status= ?, application_number = ? WHERE uuid = ?`;
    await pool.query(query,[setStatus,applicationNumber,uuid]);
  }else{
    const query = `UPDATE membership_forms set status= ? WHERE uuid = ?`;
    await pool.query(query,[setStatus,uuid]);
  }
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