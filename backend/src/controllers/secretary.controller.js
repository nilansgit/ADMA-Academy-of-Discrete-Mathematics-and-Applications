import { FORM_STATUS } from "../constants/formStatus.js";
import { checkStatus } from "../models/forms.model.js";
import { secretaryApprove, getAllForms, getCounts, getFormDetails, secretaryReject } from "../models/secretary.model.js";


export const secretaryApproveController = async (req, res) => {
  const { uuid } = req.params;

  const rows = await checkStatus(uuid);

  if (rows[0].status !== FORM_STATUS.FORWARDED_TO_SECRETARY) {
    return res.status(400).json({ error: "Invalid state" });
  }

  await secretaryApprove(uuid);

  res.json({ success: true });
};

export const secretaryRejectController = async (req, res) => {
  const { uuid } = req.params;
  const { reason } = req.body;

  const rows = await checkStatus(uuid);
  console.log(rows);

  if (rows[0].status !== FORM_STATUS.FORWARDED_TO_SECRETARY) {
    return res.status(400).json({ error: "Invalid state" });
  }

  await secretaryReject(uuid, reason);

  res.json({ success: "rejected by secretary" });
}

export const getFormsCountController = async (req, res) => {
  const result = await getCounts();
  res.send(result);
}

export const allFormsController = async (req, res) => {
  try {
    const statuses = req.query;
    const [rows] = await getAllForms(statuses);
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getFormDetailsController = async (req, res) => {
  try {
    const { uuid } = req.params;
    const { status } = req.query;
    const [rows] = await getFormDetails(uuid, status);
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}
