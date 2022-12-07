const express = require("express");
const { Router } = express;
const productsRouter = require("./router/productsRouter");
const cartRouter = require("./router/cartRouter");
const Container = require("./container");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("json spaces", 2);

app.use("/api/productos", productsRouter);
app.use("/api/carrito", cartRouter);
const PORT = process.env.port || 8080;
const server = app.listen(PORT, () =>
  console.log(`Servidor escuchando en el puerto ${PORT}`)
);
server.on("error", (error) => console.log("Hubo un error: " + error));
