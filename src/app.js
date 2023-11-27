import express from "express";
import handlebars from "express-handlebars";
import mongoose from "mongoose";
//import { Server } from "socket.io";
//import { ProductManager } from "./dao/filesystem/products/index.js";
import __dirname from "./dirname.js";
import router from "./routes/index.js";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use(express.static(__dirname + "/public"));

app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Server PORT: ${PORT}`);
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

//Socket
//const productManager = new ProductManager();
//const httpServer = app.listen(PORT, () => {
//  console.log(`Server PORT: ${PORT}`);
//});

//const socketServer = new Server(httpServer);

//socketServer.on("connection", (socket) => {
//  console.log("Nuevo cliente conectado");

//  socket.on("products", async () => {
//    try {
//      const products = await productManager.getProducts();
//      socket.emit("products", products);
//    } catch (error) {
//      console.log(error);
//    }
//  });

//  socket.on("addProduct", async (product) => {
//    try {
//      const products = await productManager.addProduct(product);
//      socket.emit("products", products);
//    } catch (error) {
//      console.log(error);
//    }
//  });

//  socket.on("deleteProduct", async (id) => {
//    try {
//      const products = await productManager.deleteProduct(id);
//      socket.emit("products", products);
//    } catch (error) {
//      console.log(error);
//    }
//  });
//});
