import { Router } from "express";
import productRouter from "./products/index.js";
import cartRouter from "./carts/index.js";

const router = new Router();

router.use("/products", productRouter);
router.use("/carts", cartRouter);

export default router;
