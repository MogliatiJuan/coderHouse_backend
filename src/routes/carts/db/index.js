import { Router } from "express";
import CartManager from "../../../dao/db/carts/index.js";

const router = Router();
const cartManager = new CartManager();

router.get("/", async (_req, res) => {
  try {
    const cart = await cartManager.getCartAll();
    res.send(cart);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/", async (_req, res) => {
  try {
    const cart = await cartManager.createCart();
    res.status(201).send(cart);
  } catch (error) {
    res
      .status(500)
      .send({ message: "No se pudo crear el carrito", error: error });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const cart = await cartManager.getCart(req.params.cid);
    res.send(cart);
  } catch (error) {
    res.status(500).send({
      message: `No se pudo obtener el carrito con ID ${req.params.cid}`,
      error: error,
    });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cart = await cartManager.addProductToCart(
      req.params.cid,
      req.params.pid
    );
    res.send(cart);
  } catch (error) {
    res.status(500).send({
      message: `No se pudo agregar el producto al carrito con ID ${req.params.cid}`,
      error: error,
    });
  }
});

export default router;
