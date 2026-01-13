import { Router } from 'express';
import { secretaryApproveController, secretaryRejectController, getFormDetailsController, getFormsCountController, allFormsController } from '../controllers/secretary.controller.js';
import { authenticate } from '../middlewares/authenticate.js';
import { requireRole } from '../middlewares/authorizeRole.js';
const router = Router();

router.use(authenticate, requireRole(['secretary']))

router.post("/:uuid/approve", secretaryApproveController);
router.post("/:uuid/reject", secretaryRejectController);
router.get("/formsCount", getFormsCountController);
router.get("/forms", allFormsController);
router.get("/forms/:uuid", getFormDetailsController);


export default router;