import {FORM_STATUS} from "../constants/formStatus.js";
import { checkStatus } from "../models/forms.model.js";
import { secretaryApprove, secretaryReject } from "../models/secretary.model.js";


export const secretaryApproveController = async (req, res) => {
  const { uuid } = req.params;

  const rows = await checkStatus(uuid);

  if (rows[0].status !== FORM_STATUS.FORWARDED_TO_SECRETARY) {
    return res.status(400).json({ error: "Invalid state" });
  }

  await secretaryApprove(uuid);

  res.json({ success: true });
};

export const secretaryRejectController =  async(req,res) => {
  const { uuid } = req.params;
  const {reason} = req.body;

  const rows = await checkStatus(uuid);
  console.log(rows);

  if (rows[0].status !== FORM_STATUS.FORWARDED_TO_SECRETARY) {
    return res.status(400).json({ error: "Invalid state" });
  }

  await secretaryReject(uuid, reason);

  res.json({ success: "rejected by secretary" });
}
  