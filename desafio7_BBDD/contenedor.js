import fs from "fs";
export default class Contenedor {
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
    const str = JSON.stringify(arrayObjetos, null, 2);
    try {
      await fs.promises.writeFile(this.archivo, str);
    } catch (err) {
      console.log("No se pudo guardar");
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
}
