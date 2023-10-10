import fs from "fs";
class ProductManager {
  constructor() {
    this.products = [];
    this.nextId = 1;
    this.path = "./products.json";
  }

  async addProduct(product) {
    if (
      !product.title ||
      !product.description ||
      !product.price ||
      !product.thumbnail ||
      !product.stock ||
      !product.code
    ) {
      throw new Error("Todos los campos son requeridos");
    }

    try {
      const productsJSON = await fs.promises.readFile(this.path, "utf-8");
      const products = JSON.parse(productsJSON);
      this.nextId = products.length + 1;
      product.id = this.nextId++;
      products.push(product);
      await fs.promises.writeFile(this.path, JSON.stringify(products));
    } catch {
      product.id = this.nextId++;
      this.products.push(product);
      await fs.promises.appendFile(this.path, JSON.stringify([product]) + "\n");
    }
  }

  async getProducts() {
    try {
      await fs.promises.access(this.path);
    } catch {
      await fs.promises.writeFile(this.path, "[]");
    }

    try {
      const dataJSON = await fs.promises.readFile(this.path, "utf-8");
      const data = JSON.parse(dataJSON);
      return data;
    } catch {
      throw new Error("No se pudo leer el archivo");
    }
  }

  async getProductById(id) {
    try {
      const productsJSON = await fs.promises.readFile(this.path, "utf-8");
      const productsParsed = JSON.parse(productsJSON);
      const products = productsParsed.find((p) => p.id === id);
      if (!products) {
        throw new Error("Not Found");
      }
      return products;
    } catch {
      throw new Error("No existe ese ID dentro de los productos");
    }
  }

  async updateProduct(id, updatedProperty) {
    try {
      const productsJSON = await fs.promises.readFile(this.path, "utf-8");
      const productsParsed = JSON.parse(productsJSON);
      const productIndex = productsParsed.findIndex((p) => p.id === id);
      if (productIndex === -1) {
        throw new Error("Producto no encontrado");
      }

      const product = productsParsed[productIndex];
      Object.keys(updatedProperty).forEach((key) => {
        product[key] = updatedProperty[key];
      });
      productsParsed[productIndex] = product;
      await fs.promises.writeFile(this.path, JSON.stringify(productsParsed));
    } catch {
      throw new Error("Error al actualizar el producto");
    }
  }

  async deleteProduct(id) {
    try {
      const productsJSON = await fs.promises.readFile(this.path, "utf-8");
      let productsParsed = JSON.parse(productsJSON);
      const productIndex = productsParsed.findIndex((p) => p.id === id);
      if (productIndex === -1) {
        throw new Error("Producto no encontrado");
      }
      productsParsed = productsParsed.filter((p) => p.id !== id);
      if (productsParsed.length === 0) {
        await fs.promises.writeFile(this.path, "[]");
      } else {
        await fs.promises.writeFile(this.path, JSON.stringify(productsParsed));
      }
      return productsParsed;
    } catch {
      throw new Error("Error al eliminar el producto");
    }
  }
}

async function run() {
  const instancia = new ProductManager();

  //console.log("Test pre-addProduct ->", await instancia.getProducts());

  // await instancia.addProduct({
  //   title: "producto prueba",
  //   description: "este es un producto prueba",
  //   price: 200,
  //   thumbnail: "Sin imagen",
  //   code: "abc123",
  //   stock: 25}
  //   )
  // console.log("Productos agregados:", await instancia.getProducts());

  // console.log("Producto obtenido por ID:",await instancia.getProductById(1))

  // console.log("Productos agregados:", await instancia.getProducts());
  // await instancia.updateProduct(1, {title: "Producto actualizado", description: "test de update"})
  // console.log("Producto actualizado:", await instancia.getProductById(1));

  // console.log("Pre eliminación ->", await instancia.getProducts());
  // console.log("Post eliminación ->", await instancia.deleteProduct(1))
}
run();
