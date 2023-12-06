import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productsCollection = "products";

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  code: String,
  price: Number,
  status: Number,
  stock: Number,
  category: String,
  thumbnail: { type: Array, default: [] },
});

productSchema.plugin(mongoosePaginate);

export const productsMongo = mongoose.model(productsCollection, productSchema);
