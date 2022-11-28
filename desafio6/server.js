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
app.get("/productos", async (req, res) => {
  try {
    const productos = await contenedorProductos.getAll();
    res.render("inicio", { productos });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
});

app.post("/productos", (req, res) => {
  contenedorProductos.save(req.body);
  res.redirect("/productos");
});
app.get("/productos/borrar/:id", (req, res) => {
  console.log("Borrar");
  const id = parseInt(req.params.id);
  contenedorProductos.deleteById(id);
  res.redirect("/productos");
});

//Sockets
const mensajes = [
  { author: "Dario", text: "los temas están separados en tres bloques" },
  { author: "Ivan", text: "ivan" },
  { author: "Ariel", text: "Tony, Bruce" },
  { author: "Pedro", text: "Choco" },
];
io.on("connection", (socket) => {
  console.log("Un cliente se ha conectado");

  socket.emit("messages", mensajes);

  socket.on("new-message", (data) => {
    mensajes.push(data);

    io.sockets.emit("messages", mensajes);
  });
});

//Servidor
const PORT = 8080;
httpServer.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
