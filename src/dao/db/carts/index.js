import { cartsMongo } from "../../models/index.js";

class CartManager {
  async createNewCart() {
    try {
      let cart = {};
      cart.products = [];
      return await cartsMongo.create(cart);
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getAll() {
    try {
      return await cartsMongo.find();
    } catch (error) {
      console.log(error);
      throw new Error();
    }
  }

  async getCartById(cid) {
    try {
      return await cartsMongo.findById(cid);
    } catch (error) {
      console.log(error);
      throw Error(error);
    }
  }

  async createProductInCart(cid, pid) {
    try {
      let cart = await cartsMongo.findOne({ _id: cid });
      if (!cart) {
        cart = await this.createNewCart();
      }
      const productExist = cart.products.findIndex(
        (p) => p?.product?._id.toString() === pid
      );
      if (productExist === -1) {
        cart.products.push({ product: pid, quantity: 1 });
      } else {
        cart.products[productExist].quantity++;
      }
      await cart.save();
      return cartsMongo.findById(cid);
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  async deleteCart(cid, pid) {
    try {
      if (!pid) {
        return await cartsMongo.findByIdAndDelete(cid);
      } else if (pid) {
        const cart = await cartsMongo.findById(cid);
        const productIndex = cart.products.findIndex(
          (prod) => prod?.product?._id.toString() === pid
        );
        if (productIndex != -1) {
          cart.products.splice(productIndex, 1);
          await cartsMongo.findByIdAndUpdate(cid, {
            products: cart.products,
          });
          return cartsMongo.findById(cid);
        } else {
          throw new Error(`Product with ID: ${pid} not found`);
        }
      }
    } catch (error) {
      console.log(error);
      throw Error(error);
    }
  }

  async updateCart(cid, product) {
    try {
      await cartsMongo.updateOne(
        { _id: cid },
        { $set: { products: [{ product }] } }
      );
      const cart = await cartsMongo.findById({ _id: cid });
      return cart;
    } catch {
      throw new Error("Update failed");
    }
  }

  async updateQuantityCart(params, body) {
    try {
      const { quantity } = body;
      if (quantity > 0) {
        const product = await cartsMongo.findOne({ _id: params.cid });
        const productPosition = product.products.findIndex(
          (p) => p.product._id.toString() === params.pid
        );
        if (productPosition != -1) {
          product.products[productPosition].quantity = quantity;
          await cartsMongo.findOneAndUpdate(
            {
              _id: params.cid,
              "products._id": product.products[productPosition]._id,
            },
            { $set: { "products.$.quantity": quantity } },
            { new: true }
          );
          return await cartsMongo.findById(params.cid);
        }
      } else {
        throw new Error("Quantity must be more than 0");
      }
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default CartManager;
