import { cartsMongo } from "../../models/index.js";
export default class CarstDAO {
  getAll() {
    try {
      return cartsMongo.find();
    } catch (error) {
      throw new Error();
    }
  }

  async getCartById(cid) {
    try {
      return await cartsMongo.findById(cid);
    } catch (error) {
      throw Error(error);
    }
  }

  createNewCart() {
    try {
      return cartsMongo.create({});
    } catch (error) {
      throw new Error(error);
    }
  }

  async addProductToCart(cart, pid) {
    try {
      cart.products.push({ product: pid, quantity: 1 });
      await cart.save();
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }

  async increaseQuantityOfProduct(cart, pid) {
    try {
      cart.products[pid].quantity++;
      await cart.save();
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }

  deleteCart(cid) {
    try {
      return cartsMongo.findByIdAndDelete(cid);
    } catch (error) {
      throw Error(error);
    }
  }

  deleteProductInCart(cart) {
    return cartsMongo.findByIdAndUpdate(
      cart._id,
      {
        products: cart.products,
      },
      { new: true }
    );
  }

  updateCart(cid, product) {
    try {
      return cartsMongo.updateOne(
        { _id: cid },
        { $set: { products: [{ product }] } }
      );
    } catch {
      throw new Error("Update failed");
    }
  }

  updateQuantityOfProduct(cart) {
    try {
      return cart.save();
    } catch (error) {
      throw new Error(error);
    }
  }
}
