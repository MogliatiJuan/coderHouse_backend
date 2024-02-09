import { Router } from "express";
import cartRouter from "./carts.router.js";
import productRouter from "./products.router.js";
import viewRouter from "./views/index.js";
import messageRouter from "./messages/index.js";
import sessionsRouter from "./sessions/index.js";
import notifications from "./api/notifications.js";
import { authMiddleware, authRolesMiddleware } from "../helpers/jwt.js";

const router = new Router();

router.use("/products", productRouter);
router.use("/carts", cartRouter);
router.use("/views", viewRouter);
router.use(
  "/chat",
  authMiddleware("jwt"), //agregar payload al req
  authRolesMiddleware("user"), //verificar que solo rol 'user' ingrese
  messageRouter
);
router.use("/sessions", sessionsRouter);
router.use("/notifications", notifications);

export default router;
