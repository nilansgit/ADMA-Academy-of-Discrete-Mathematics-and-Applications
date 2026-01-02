import { Router } from "express";
import { loginUserController } from "../controllers/auth.controller.js";
const router = Router();

router.post("/login",loginUserController);

export default router;