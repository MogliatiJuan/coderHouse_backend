import * as dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

export const generateToken = (user) => {
  const { id, name, email, firstName, lastName, role, age } = user;
  const payload = { id, name, email, firstName, lastName, role, age };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
};

export const validateToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (error, payload) => {
      if (error) {
        return reject(error);
      }
      resolve(payload);
    });
  });
};
