import express from "express";
import ProductManager from "./controllers/index.js";

const app = express();
const PORT = 8080;
const productManager = new ProductManager();

app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  res.json({ message: "Bienvenido al desafío Servidor con Express" });
});

app.get("/products", async (req, res) => {
  const { limit } = req.query;
  const products = await productManager.getProducts();
  const limitProducts = products.slice(0, limit);
  limit ? res.send(limitProducts) : res.send(products);
});

app.get("/products/:pid", async (req, res) => {
  const idProduct = await productManager.getProductById(
    Number.parseInt(req.params.pid)
  );
  res.send(idProduct);
});

app.listen(PORT, () => {
  console.log(`Server on PORT ${PORT}`);
});
