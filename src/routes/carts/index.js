import { Router } from "express";
import { CartManager } from "../../controllers/index.js";

const router = Router();
const cartsRouter = new CartManager();

router.post("/", async (request, response) => {
  try {
    const cart = await cartsRouter.createCart();
    response
      .status(200)
      .send({ status: "success", message: "Cart created", carts: cart });
  } catch (error) {
    response.status(400).send({ status: "error", message: error.message });
  }
});

router.get("/:cid", async (request, response) => {
  try {
    const cartId = await cartsRouter.getCartById(request.params.cid);
    response
      .status(200)
      .send({ status: "success", message: "Cart founded", cart: cartId });
  } catch (error) {
    response.status(404).send({ status: "error", message: error.message });
  }
});

router.post("/:cid/product/:pid", async (request, response) => {
  try {
    const cartProduct = await cartsRouter.addProductToCart(
      request.params.cid,
      request.params.pid
    );
    response
      .status(200)
      .send({ status: "success", message: "Cart founded", carts: cartProduct });
  } catch (error) {
    response.status(400).send({ status: "error", message: error.message });
  }
});

export default router;
