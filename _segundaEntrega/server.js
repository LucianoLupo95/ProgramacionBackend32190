const express = require("express");
const { productsRouter } = require("./router/productsRouter");
const cartRouter = require("./router/cartRouter");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("json spaces", 2);

app.use("/api/productos", productsRouter);
app.use("/api/carrito", cartRouter);
app.get("*", (req, res) => {
  res.status(404).json({
    error: -2,
    description: `Ruta ${req.originalUrl} método GET no definida`,
  });
});
app.post("*", (req, res) => {
  res.status(404).json({
    error: -2,
    description: `Ruta ${req.originalUrl} método POST no definida`,
  });
});
app.delete("*", (req, res) => {
  res.status(404).json({
    error: -2,
    description: `Ruta ${req.originalUrl} método DELETE no definida`,
  });
});
app.put("*", (req, res) => {
  res.status(404).json({
    error: -2,
    description: `Ruta ${req.originalUrl} método PUT no definida`,
  });
});

const PORT = process.env.port || 8080;
const server = app.listen(PORT, () =>
  console.log(`Servidor escuchando en el puerto ${PORT}`)
);
server.on("error", (error) => console.log("Hubo un error: " + error));
