import { getPhoto, getReceipt } from "../models/membership.model.js"
import path from "path";

export const getPhotoController = async(req,res) => {
    const {uuid} = req.params;

    const [rows] = await getPhoto(uuid);

    console.log(rows);

    if(!rows.length || !rows[0].passportPhoto) { 
        return res.status(404).end(); 
    }

    const absolutePath = path.resolve(rows[0].passportPhoto);

    res.sendFile(absolutePath);
}

export const getReceiptController = async(req,res) => {
    const {uuid} = req.params;

    const [rows] = await getReceipt(uuid);

    if(!rows.length || !rows[0].paymentReceipt) { 
        return res.status(404).end(); 
    }

    const absolutePath = path.resolve(rows[0].paymentReceipt);

    res.sendFile(absolutePath);
}