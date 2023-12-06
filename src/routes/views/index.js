import { Router } from "express";
import { CartManagerMongo, ProductManager } from "../../dao/index.js";
import { productsMongo } from "../../dao/models/index.js";

const router = Router();
const productManager = new ProductManager();
const cartManager = new CartManagerMongo();

router.get("/", async (_request, response) => {
  const products = await productManager.getProducts();
  response.render("home", { products });
});

router.get("/realtimeproducts", async (_request, response) => {
  const products = await productManager.getProducts();
  response.render("realTimeProducts", { products });
});

router.get("/products", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const products = await productsMongo.paginate(
      {},
      { page, limit, lean: true }
    );
    res.render("products", { products });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching products");
  }
});

router.get("/carts/:cid", async (req, res) => {
  // probar :cid = 656fc3c70da0ff84e5f8001b
  try {
    const { cid } = req.params;
    let cart = await cartManager.getCartById(cid);
    res.render("carts", { cart: cart.toJSON() });
  } catch {}
});
export default router;
