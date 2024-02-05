import express from "express";
import handlebars from "express-handlebars";
import mongoose from "mongoose";
import { Server } from "socket.io";
import session from "express-session";
import mongoStore from "connect-mongo";
import passport from "passport";
import cookieParser from "cookie-parser";
import __dirname from "./dirname.js";
import router from "./routes/index.js";
import MessageManager from "./dao/db/messages/index.js";
import { passportStrategy } from "./config/passport.js";
import config from "./config/config.js";

const app = express();
const PORT = 8080;
app.use(cookieParser());
app.set("port", process.env.PORT || 8080);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    store: mongoStore.create({
      mongoUrl: config.DB_URL,
      mongoOptions: {},
      ttl: 240,
    }),
    secret: "secretPassword",
    resave: true, // cada vez que se actualiza la pagina se resetea el ttl
    saveUninitialized: true,
  })
);
passportStrategy();
app.use(passport.initialize());
//app.use(passport.session());

handlebars.create({ allowProtoMethodsByDefault: true });
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));

app.use("/api", router);

app.use((error, req, res, next) => {
  const message = `Hubo un error en la petición`;
  const detail = `${error.message}`;
  res.status(500).json({ message, detail });
});

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
if (config.PERSISTENCE === "mongoDB") {
  const connectMongoDB = async () => {
    try {
      await mongoose.connect(config.DB_URL);
      console.log("Conectado a MongoDB con Mongoose");
    } catch (error) {
      console.log("No se pudo conectar a la BD con Mongoose");
      process.exit();
    }
  };

  connectMongoDB();
}
