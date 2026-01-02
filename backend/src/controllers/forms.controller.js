import { v4 as uuidv4 } from "uuid";
import { createForm, getFormByUUID, saveDraft, submitForm, checkStatus, uploadFile } from "../models/forms.model.js";
import {FORM_STATUS} from "../constants/formStatus.js";
import { deleteFileIfExists } from "../services/fileCleanup.service.js";


export const createFormController = async (req, res) => {
  try {
    const uuid = uuidv4();

    await createForm(uuid);

    res.status(201).json({uuid});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create form" });
  }
};


export const getFormController = async (req, res) => {
  try {
    const { uuid } = req.params;

    const form = await getFormByUUID(uuid);

    if (!form) {
      return res.status(404).json({ error: "Invalid form link" });
    }

    res.json(form);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch form" });
  }
};

export const saveDraftController = async (req, res) => {
  try{
    const { uuid } = req.params;
    const rows = await checkStatus(uuid);

    if (!rows.length || rows[0].status !== "DRAFT") {
      return res.status(403).json({ error: "Form is locked" });
    }

    const { data, currentStep, email } = req.body;
    await saveDraft(uuid,data,currentStep,email);
  }catch(err){
    console.error(err);
    res.status(500).json({error: "Failed to save the draft"})
  }


  res.json({ success: true });
};


export const submitFormController = async(req,res) => {
  const {uuid} = req.params;

  const rows = await checkStatus(uuid);
  console.log(rows);

  if (!rows.length) {
    return res.status(404).json({ error: "Form not found" });
  }

  const currentStatus = rows[0].status;

  if (currentStatus !== FORM_STATUS.DRAFT && !currentStatus.endsWith("_REJECTED")) {
    return res.status(400).json({ error: "Form already submitted" });
  }

  await submitForm(uuid);
  console.log("form Submiited",uuid);

  res.json({success: true});
}

export const uploadFileController =  async(req,res) => {
  let {receipt_path} = req.receipt;
  let {pp_path} = req.pp;
  const {uuid} = req.params;

  // Photo re-upload
  if (req.files?.passportPhoto) {
    deleteFileIfExists(pp_path);
    pp_path = req.files.passportPhoto[0].path;
  }

  // // Receipt re-upload
  if (req.files?.paymentReceipt) {
    deleteFileIfExists(receipt_path);
    receipt_path = req.files.paymentReceipt[0].path;
  }

  const result= await uploadFile(uuid,receipt_path,pp_path);

  res.json({result: result})

   
}