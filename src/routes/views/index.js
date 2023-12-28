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
    if (!req.cookies.token) return res.redirect("/api/views/login");
    const { page = 1, limit = 10 } = req.query;
    const products = await productsMongo.paginate(
      {},
      { page, limit, lean: true }
    );
    res.render("products", { products, user: req.cookies.token });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching products");
  }
});

router.get("/carts/:cid", async (req, res) => {
  // probar :cid = 656fc3c70da0ff84e5f8001b
  try {
    if (!req.cookies.token) return res.redirect("/api/views/login");
    const { cid } = req.params;
    let cart = await cartManager.getCartById(cid);
    res.render("carts", { cart: cart.toJSON() });
  } catch {
    console.log(error);
    res.status(500).send({ message: error });
  }
});
export default router;

router.get("/profile", async (req, res) => {
  try {
    if (!req.cookies.token) return res.redirect("/api/views/login");
    res.render("profile", { user: req.cookies.token });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error });
  }
});

router.get("/login", async (req, res) => {
  try {
    if (req.cookies.token) return res.redirect("/api/views/products");
    res.render("login", {});
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error });
  }
});
router.get("/register", async (req, res) => {
  try {
    if (req.cookies.token) return res.redirect("/api/views/products");
    res.render("register", {});
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error });
  }
});
