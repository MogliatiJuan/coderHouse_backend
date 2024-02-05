import { Router } from "express";
import { CartsDTO, ProductsInCartDTO } from "../dto/index.js";
import CartsController from "../controllers/carts.controller.js";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const cart = await CartsController.getAll();

    const cartFormatted = cart.map((c) => new CartsDTO(c));
    res.send(cartFormatted);
  } catch (error) {
    next(error);
  }
});

router.get("/:cid", async (req, res, next) => {
  try {
    const cart = await CartsController.getById(req.params.cid);
    if (!cart) {
      throw new Error(`Cart wiht ID: ${req.params.cid} not founded`);
    }
    res.send(new ProductsInCartDTO(cart));
  } catch (error) {
    next(error);
  }
});

router.post("/", async (_req, res, next) => {
  try {
    const cart = await CartsController.createNewCart();
    res.status(201).send(new ProductsInCartDTO(cart));
  } catch (error) {
    next(error);
  }
});

router.post("/:cid/product/:pid", async (req, res, next) => {
  try {
    let cartFounded = await CartsController.getById(req.params.cid);
    if (!cartFounded)
      throw new Error(`Cart wiht ID: ${req.params.cid} not founded`);
    const cart = await CartsController.addProductOrIncreaseQuantity(
      cartFounded,
      req.params.pid
    );
    if (cart) cartFounded = await CartsController.getById(req.params.cid);
    res.send(new ProductsInCartDTO(cartFounded));
  } catch (error) {
    next(error);
  }
});

router.put("/:cid", async (req, res, next) => {
  try {
    let cartFounded;
    const cart = await CartsController.updateById(req.params.cid, req.body);
    if (cart) cartFounded = await CartsController.getById(req.params.cid);
    if (!cartFounded)
      throw new Error(`Cart wiht ID: ${req.params.cid} not founded`);
    res.send({
      message: "Cart updated",
      cart: new ProductsInCartDTO(cartFounded),
    });
  } catch (error) {
    next(error);
  }
});

router.put("/:cid/products/:pid", async (req, res, next) => {
  try {
    const { quantity } = req.body;
    if (!quantity) throw new Error("'quantity' field is required");
    let cartFounded = await CartsController.getById(req.params.cid);
    if (!cartFounded)
      throw new Error(`Cart wiht ID: ${req.params.cid} not founded`);
    const cart = await CartsController.updateQuantityOfProduct(
      req.params,
      quantity,
      cartFounded
    );
    res.send({ message: "Cart updated", cart: new ProductsInCartDTO(cart) });
  } catch (error) {
    next(error);
  }
});

router.delete("/:cid", async (req, res, next) => {
  try {
    const productDeleted = await CartsController.deleteById(req.params.cid);
    if (!productDeleted)
      throw new Error(`Cart wiht ID: ${req.params.cid} not founded`);

    res.send({ message: "Cart deleted", cart: new CartsDTO(productDeleted) });
  } catch (error) {
    next(error);
  }
});

router.delete("/:cid/products/:pid", async (req, res, next) => {
  try {
    const cartFounded = await CartsController.getById(req.params.cid);
    const productDeleted = await CartsController.deleteProductInCart(
      cartFounded,
      req.params.pid
    );
    res.send(new CartsDTO(productDeleted));
  } catch (error) {
    next(error);
  }
});

export default router;
