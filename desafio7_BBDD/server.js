//Modulos y seteos
import express from "express";
import { Server as HttpServer } from "http";
import { Server as IOServer } from "socket.io";
import { SQLLiteoptions } from "./options/sqlLiteconn.js";
import { mySQLoptions } from "./options/mysqlconn.js";
import SQLClient from "./SQLClient.js";
const mysql = new SQLClient(mySQLoptions, "products");
const sqlite = new SQLClient(SQLLiteoptions, "chat");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
const httpServer = HttpServer(app);
const io = new IOServer(httpServer);
app.use(express.static("public"));

//Productos
app.get("/productos", async (req, res) => {
  try {
    const productos = await mysql.getAll();
    res.render("inicio", { productos });
  } catch (err) {
    res.status(401).json({ err });
  }
});

//Sockets
io.on("connection", async (socket) => {
  console.log("Un cliente se ha conectado");
  const productos = await mysql.getAll();
  const mensajes = await sqlite.getAll();
  socket.emit("productos", productos);
  socket.emit("mensajes", mensajes);

  socket.on("new-product", async (data) => {
    await mysql.add(data);
    const productos = await mysql.getAll();
    io.sockets.emit("productos", productos);
  });
  socket.on("delete-product", async (id) => {
    await mysql.deletebyId(id);
    const productos = await mysql.getAll();
    io.sockets.emit("productos", productos);
  });
  socket.on("new-message", async (data) => {
    await sqlite.add(data);
    const mensajes = await sqlite.getAll();
    io.sockets.emit("mensajes", mensajes);
  });
});

//Servidor
const PORT = 8080;
httpServer.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
