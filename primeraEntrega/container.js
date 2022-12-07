const fs = require("fs");
class Container {
  constructor(archivo) {
    this.archivo = archivo;
  }
  async save(obj) {
    const arrayObjetos = await this.getAll();
    arrayObjetos.push(obj);
    let indice = arrayObjetos.indexOf(obj);
    if (arrayObjetos.length <= 1) {
      arrayObjetos[indice]["id"] = 1;
    } else {
      arrayObjetos[indice]["id"] = arrayObjetos[indice - 1]["id"] + 1;
    }
    arrayObjetos[indice]["timestamp"] = new Date().toLocaleString();
    const str = JSON.stringify(arrayObjetos, null, 2);
    try {
      await fs.promises.writeFile(this.archivo, str);
      return arrayObjetos[indice]["id"];
    } catch (err) {
      console.log("No se pudo guardar");
    }
  }
  async put(id, updatedElement) {
    let array = await this.getAll();
    let oldElement = array.find((e) => e.id === id);
    if (!oldElement) {
      return null;
    } else {
      const index = array.indexOf(oldElement);
      for (let key in updatedElement) {
        array[index][key] = updatedElement[key];
      }
      const str = JSON.stringify(array, null, 2);
      try {
        await fs.promises.writeFile(this.archivo, str);
        return true;
      } catch (err) {
        console.log("No se pudo guardar");
        return false;
      }
    }
  }
  async getById(id) {
    let array = await this.getAll();
    let element = array.find((e) => e.id === id);
    if (element == undefined) {
      element = null;
    }
    return element;
  }
  async getAll() {
    try {
      const contenido = await fs.promises.readFile(this.archivo, "utf-8");
      const obj = JSON.parse(contenido);
      return obj;
    } catch (err) {
      return [];
    }
  }
  async deleteById(id) {
    let array = await this.getAll();
    let nuevoArray = array.filter((e) => e.id !== id);
    const str = JSON.stringify(nuevoArray, null, 2);
    try {
      await fs.promises.writeFile(this.archivo, str);
    } catch (err) {
      console.log("No se pudo borrar");
    }
  }
  async deleteAll() {
    try {
      await fs.promises.writeFile(this.archivo, []);
    } catch {
      console.log("No se pudo eliminar");
    }
  }
  async fillCart(cartId, product) {
    const cart = await this.getById(cartId);
    cart.productos.push(product);
    this.put(cartId, cart);
  }
  async deleteProduct(cartId, productId) {
    const cart = await this.getById(cartId);
    let product = cart.productos.find((e) => e.id === productId);
    console.log(product);
    if (product == undefined) {
      return null;
    } else {
      let index = cart.productos.indexOf(product);
      cart.productos.splice(index, 1);
      await this.put(cartId, cart);
      return true;
    }
  }
}
module.exports = Container;
