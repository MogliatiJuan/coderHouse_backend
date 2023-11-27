import { Router } from "express";
//import productRouter from "./products/index.js";
//import cartRouter from "./carts/index.js";
import cartRouter from "./carts/db/index.js";
import productRouter from "./products/db/index.js";
import viewRouter from "./views/index.js";
import messageRouter from "./messages/index.js";

const router = new Router();

router.use("/products", productRouter);
router.use("/carts", cartRouter);
router.use("/views", viewRouter);
router.use("/chat", messageRouter);

export default router;
