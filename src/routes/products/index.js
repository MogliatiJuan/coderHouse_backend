import { Router } from "express";
import { ProductManager } from "../../controllers/index.js";

const router = Router();
const productManager = new ProductManager();

router.get("/", async (request, response) => {
  const { limit } = request.query;
  const products = await productManager.getProducts();
  const limitProducts = products.slice(0, limit);
  limit ? response.send(limitProducts) : response.send(products);
});

router.get("/:pid", async (request, response) => {
  const product = await productManager.getProductById(
    Number.parseInt(request.params.pid)
  );
  response.send(product);
});

router.post("/", async (request, response) => {
  const product = await productManager.addProduct({
    title: "Test product",
    description: "This is a testing product",
    code: "abc123",
    price: 200,
    status: true,
    stock: 20,
    category: "Testing",
    thumbnail: ["non-image"],
  });
  response.send(product);
});

router.put("/:pid", async (request, response) => {
  const product = await productManager.updateProduct(
    Number.parseInt(request.params.pid),
    {
      title: "Modified product",
      description: "This product was modified",
      price: 500,
    }
  );
  response.send(product);
});

router.delete("/:pid", async (request, response) => {
  const product = await productManager.deleteProduct(
    Number.parseInt(request.params.pid)
  );
  response.send(product);
});

export default router;
