import { cartsMongo } from "../../models/index.js";

class CartManager {
  async createCart() {
    try {
      let cart = {};
      cart.products = [];
      return await cartsMongo.create(cart);
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getCart(id) {
    try {
      return await cartsMongo.findOne({ _id: id });
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async addProductToCart(cid, pid) {
    try {
      const isInCart = await cartsMongo.findById(cid);
      if (isInCart) {
        const productExist = isInCart.products.findIndex((p) => p.id === pid);
        if (productExist === -1) {
          isInCart.products.push({ quantity: 1 });
        } else {
          isInCart.products[productExist].quantity++;
        }
        return await cartsMongo.create(isInCart);
      } else {
        throw new Error(`No se encontró un carrito con el cid: ${cid}`);
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

export default CartManager;
