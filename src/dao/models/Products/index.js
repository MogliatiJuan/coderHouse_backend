import mongoose from "mongoose";

const productsCollection = "products";

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  code: String,
  price: Number,
  status: Number,
  stock: Number,
  category: String,
  thumbnail: [],
});

export const productsMongo = mongoose.model(productsCollection, productSchema);
