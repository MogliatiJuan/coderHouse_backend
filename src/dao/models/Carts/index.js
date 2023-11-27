import mongoose from "mongoose";

const cartsCollection = "carts";

const cartsSchema = new mongoose.Schema({
  products: [
    {
      quantity: Number,
    },
  ],
});

export const cartsMongo = mongoose.model(cartsCollection, cartsSchema);
