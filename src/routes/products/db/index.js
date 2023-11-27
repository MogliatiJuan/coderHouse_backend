import { Router } from "express";
import { productsMongo } from "../../../dao/models/index.js";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    let products = await productsMongo.find();
    res.send(products);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: "No se pudo obtener los datos con Mongoose",
      message: error,
    });
  }
});

router.get("/product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let product = await productsMongo.findById(id);
    res.send(product);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: "No se pudo obtener los datos con Mongoose",
      message: error,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnail,
    } = req.body;
    const product = await productsMongo.create({
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnail,
    });
    res.status(201).send(product);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: "No se pudo crear el producto con Mongoose",
      message: error,
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const productUpdated = req.body;
    const product = await productsMongo.updateOne(
      { _id: req.params.id },
      productUpdated
    );
    console.log(product);
    res.send(product);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: "No se pudo actualizar el producto con Mongoose",
      message: error,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await productsMongo.deleteOne({
      _id: req.params.id,
    });
    res.send({
      message: `Se ha eliminado con exito el producto con ID: ${req.params.id}`,
    });
  } catch (error) {
    res.status(500).send({
      error: "No se pudo eliminar el producto con Mongoose",
      message: error,
    });
  }
});

export default router;
