import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import __dirname from "./dirname.js";
import router from "./routes/index.js";
import { ProductManager } from "./controllers/index.js";

const app = express();
const PORT = 8080;

const productManager = new ProductManager();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use(express.static(__dirname + "/public"));

app.use("/api", router);

const httpServer = app.listen(PORT, () => {
  console.log(`Server PORT: ${PORT}`);
});

const socketServer = new Server(httpServer);

socketServer.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  socket.on("products", async () => {
    try {
      const products = await productManager.getProducts();
      socket.emit("products", products);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("addProduct", async (product) => {
    try {
      const products = await productManager.addProduct(product);
      socket.emit("products", products);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("deleteProduct", async (id) => {
    try {
      const products = await productManager.deleteProduct(id);
      socket.emit("products", products);
    } catch (error) {
      console.log(error);
    }
  });
});
