import { Router } from "express";
import CartManager from "../../../dao/db/carts/index.js";

const router = Router();
const cartManager = new CartManager();

router.get("/", async (_req, res) => {
  try {
    const cart = await cartManager.getAll();
    res.send(cart);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const cart = await cartManager.getCartById(req.params.cid);
    if (!cart) {
      throw new Error(`Cart wiht ID: ${req.params.cid} not founded`);
    }
    res.send(cart);
  } catch (error) {
    res.status(500).send({
      message: `No se pudo obtener el carrito con ID ${req.params.cid}`,
      error: error.message,
    });
  }
});

router.post("/", async (_req, res) => {
  try {
    const cart = await cartManager.createNewCart();
    res.status(201).send(cart);
  } catch (error) {
    res
      .status(500)
      .send({ message: "No se pudo crear el carrito", error: error });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cart = await cartManager.createProductInCart(
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

router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const cart = await cartManager.updateQuantityCart(req.params, req.body);
    res
      .status(200)
      .send({ status: "success", message: "Cart updated", carts: cart });
  } catch (error) {
    res.status(400).send({ status: "error", message: error.message });
  }
});

router.put("/:cid", async (req, res) => {
  try {
    const cart = await cartManager.updateCart(req.params.cid, req.body);
    res.send({ status: "success", message: "Cart updated", carts: cart });
  } catch (error) {
    res.status(400).send({ status: "error", message: error.message });
  }
});

router.delete("/:cid", async (req, res) => {
  try {
    const productDeleted = await cartManager.deleteCart(req.params.cid);
    res.send(productDeleted);
  } catch (error) {
    res.status(400).send({ status: "error", message: error.message });
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const productDeleted = await cartManager.deleteCart(
      req.params.cid,
      req.params.pid
    );
    res.send(productDeleted);
  } catch (error) {
    res.status(400).send({ status: "error", message: error.message });
  }
});

export default router;
