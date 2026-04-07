import { Router } from 'express';
import { getMemberscontroller } from '../controllers/members.controller.js';
import { authenticate } from '../middlewares/authenticate.js';
import { requireRole } from '../middlewares/authorizeRole.js';
const router = Router();

// router.use(authenticate, requireRole(['secretary']))

router.get("/", getMemberscontroller);

export default router;