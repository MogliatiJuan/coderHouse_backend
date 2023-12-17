import mongoose from "mongoose";

const collection = "users";

const schema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: String,
    email: { type: String, unique: true, required: true },
    password: String,
    role: { type: String, default: "user" },
    age: Number,
  },
  { timestamps: true }
);

export const Users = mongoose.model(collection, schema);
