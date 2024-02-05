import { Router } from "express";
import ProductsController from "../controllers/products.controller.js";
import { AllProductsDTO, ProductDTO } from "../dto/index.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const products = await ProductsController.getAll(req.query);
    res.send({ message: "Query finished", ...new AllProductsDTO(products) });
  } catch (error) {
    next(error);
  }
});

router.get("/product/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    let product = await ProductsController.getById(id);
    if (!product) throw Error("Product doesn't exist");
    res.send(new ProductDTO(product));
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const product = await ProductsController.addProduct(req.body);
    res.status(201).send(new ProductDTO(product));
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const productToUpdate = req.body;
    const productUpdated = await ProductsController.updateById(
      id,
      productToUpdate
    );
    if (productUpdated.acknowledged) {
      const product = await ProductsController.getById(id);
      return res.send({
        message: "The product was updated",
        product: new ProductDTO(product),
      });
    }
    throw new Error("Failed to update the product");
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const productDeleted = await ProductsController.deleteById(id);
    if (productDeleted.deletedCount > 0) {
      return res.send({
        message: `Product deleted succesfully with ID: ${id}`,
      });
    }
    throw new Error("Failed to delete the product");
  } catch (error) {
    next(error);
  }
});

export default router;
