import express from "express";
import handlebars from "express-handlebars";
import mongoose from "mongoose";
import { Server } from "socket.io";
//import ProductManager from "./dao/filesystem/products/index.js";
import __dirname from "./dirname.js";
import router from "./routes/index.js";
import * as dotenv from "dotenv";
import MessageManager from "./dao/db/messages/index.js";

dotenv.config();

const app = express();
const PORT = 8080;

app.set("port", process.env.PORT || 8080);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

handlebars.create({ allowProtoMethodsByDefault: true });
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));

app.use("/api", router);

const httpServer = app.listen(PORT, () => {
  console.log(`Server PORT: ${PORT}`);
});

//Socket
//const productManager = new ProductManager();
const messageManager = new MessageManager();

const socketServer = new Server(httpServer);

socketServer.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  socket.on("dataUser", async (data) => {
    try {
      await messageManager.createData(data);
    } catch (error) {
      console.log(error);
    }
  });

  //socket.on("products", async () => {
  //  try {
  //    const products = await productManager.getProducts();
  //    socket.emit("products", products);
  //  } catch (error) {
  //    console.log(error);
  //  }
  //});

  //socket.on("addProduct", async (product) => {
  //  try {
  //    const products = await productManager.addProduct(product);
  //    socket.emit("products", products);
  //  } catch (error) {
  //    console.log(error);
  //  }
  //});

  //socket.on("deleteProduct", async (id) => {
  //  try {
  //    const products = await productManager.deleteProduct(id);
  //    socket.emit("products", products);
  //  } catch (error) {
  //    console.log(error);
  //  }
  //});
});

//Database MongoDB
const DB = `mongodb+srv://papu:${process.env.DB_PASSWORD}@ecommerce.6g4ke0l.mongodb.net/ecommerce?retryWrites=true&w=majority`;
const connectMongoDB = async () => {
  try {
    await mongoose.connect(DB);
    console.log("Conectado a MongoDB con Mongoose");
  } catch (error) {
    console.log("No se pudo conectar a la BD con Mongoose");
    process.exit();
  }
};

connectMongoDB();
