import mongoose from "mongoose";

const collection = "users";

const schema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: "user" },
    age: Number,
  },
  { timestamps: true }
);

export const Users = mongoose.model(collection, schema);
