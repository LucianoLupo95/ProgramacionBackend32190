//Modulos y seteos
const fs = require("fs");
const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const httpServer = HttpServer(app);
const io = new IOServer(httpServer);
app.use(express.static("public"));

//Contenedor
class Contenedor {
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
//Productos
const contenedorProductos = new Contenedor("./productos.txt");
const contenedorMensajes = new Contenedor("./mensajes.txt");
app.get("/productos", async (req, res) => {
  try {
    const productos = await contenedorProductos.getAll();
    res.render("inicio", { productos });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
});

//Sockets
io.on("connection", async (socket) => {
  console.log("Un cliente se ha conectado");
  const productos = await contenedorProductos.getAll();
  const mensajes = await contenedorMensajes.getAll();
  socket.emit("productos", productos);
  socket.emit("mensajes", mensajes);

  socket.on("new-product", async (data) => {
    await contenedorProductos.save(data);
    const productos = await contenedorProductos.getAll();
    io.sockets.emit("productos", productos);
  });
  socket.on("delete-product", async (id) => {
    await contenedorProductos.deleteById(id);
    const productos = await contenedorProductos.getAll();
    io.sockets.emit("productos", productos);
  });
  socket.on("new-message", async (data) => {
    await contenedorMensajes.save(data);
    const mensajes = await contenedorMensajes.getAll();
    io.sockets.emit("mensajes", mensajes);
  });
});

//Servidor
const PORT = 8080;
httpServer.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
