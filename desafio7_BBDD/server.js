//Modulos y seteos
import express from "express";
import { Server as HttpServer } from "http";
import { Server as IOServer } from "socket.io";
import Contenedor from "./contenedor.js";
import { mySQLoptions } from "./options/mysqlconn.js";
import SQLClient from "./SQLClient.js";
const sql = new SQLClient(mySQLoptions);

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
const httpServer = HttpServer(app);
const io = new IOServer(httpServer);
app.use(express.static("public"));

//Contenedor

//Productos
const contenedorProductos = new Contenedor("./productos.txt");
const contenedorMensajes = new Contenedor("./mensajes.txt");
app.get("/productos", async (req, res) => {
  try {
    const productos = await contenedorProductos.getAll();
    res.render("inicio", { productos });
  } catch (err) {
    console.log(err);
    res.status(401).json({ err });
  }
});

//Sockets
io.on("connection", async (socket) => {
  console.log("Un cliente se ha conectado");
  // const productos = await contenedorProductos.getAll();
  const productos = await sql.getAll();
  const mensajes = await contenedorMensajes.getAll();
  socket.emit("productos", productos);
  socket.emit("mensajes", mensajes);

  socket.on("new-product", async (data) => {
    await sql.addProduct(data);
    const productos = await sql.getAll();
    io.sockets.emit("productos", productos);
  });
  socket.on("delete-product", async (id) => {
    await sql.deletebyId(id);
    const productos = await sql.getAll();
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
