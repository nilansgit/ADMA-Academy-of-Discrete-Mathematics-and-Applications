import { Router } from 'express';
import { getUsersController } from '../controllers/user.controller.js';

const router = Router();

router.get('/', getUsersController);

export default router;