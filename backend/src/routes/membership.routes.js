import { Router } from "express";
import { getPhotoController, getReceiptController } from "../controllers/membership.controller.js";


const router = Router();


router.get('/:uuid/passportPhoto',getPhotoController);
router.get('/:uuid/paymentReceipt',getReceiptController);

export default router;