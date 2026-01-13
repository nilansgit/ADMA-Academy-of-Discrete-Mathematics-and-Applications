import { Router } from 'express';
import { allFormsController, forwardToSecretaryController, getFormDetailsController, getFormsCountController, treasurerRejectController } from '../controllers/treasurer.controller.js';
import { authenticate } from '../middlewares/authenticate.js';
import { requireRole } from '../middlewares/authorizeRole.js';
const router = Router();

router.use(authenticate, requireRole(["treasurer"]))

router.post("/:uuid/forward", forwardToSecretaryController);
router.post("/:uuid/reject", treasurerRejectController);
router.get("/formsCount", getFormsCountController);
router.get("/forms", allFormsController);
router.get("/forms/:uuid", getFormDetailsController);


export default router;