import { Router } from 'express';
import { secretaryApproveController, secretaryRejectController } from '../controllers/secretary.controller.js';
const router = Router();

router.post("/:uuid/approve",secretaryApproveController);
router.post("/:uuid/reject", secretaryRejectController)


export default router;