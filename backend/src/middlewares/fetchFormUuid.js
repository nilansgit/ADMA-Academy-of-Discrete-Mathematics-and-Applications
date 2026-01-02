import { getFile } from "../models/forms.model.js";

export const fetchFormUuid = async(req,res,next) => {
    const {uuid} = req.params;

    const [rows] = await getFile(uuid);

    req.receipt = rows[0].receipt;
    req.pp = rows[0].pp;

    next();
}