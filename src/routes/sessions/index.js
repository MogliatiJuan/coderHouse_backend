import { Router } from "express";
import { login, logout, register, profile } from "../../dao/index.js";

const router = new Router();

router.post("/login", login);
router.get("/logout", logout);
router.post("/register", register);
router.get("/profile", profile);

export default router;
