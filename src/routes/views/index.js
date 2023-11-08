import { Router } from "express";
import { ProductManager } from "../../controllers/index.js";

const router = Router();
const productManager = new ProductManager();

router.get("/", async (request, response) => {
  const products = await productManager.getProducts();
  response.render("home", { products });
});

router.get("/realtimeproducts", async (request, response) => {
  const products = await productManager.getProducts();
  response.render("realTimeProducts", { products });
});

export default router;
