const express = require("express");
const { Router } = express;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
let productos = [];

const routerProductos = new Router();

routerProductos.get("/", (req, res) => {
  res.json(productos);
});
routerProductos.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const producto = productos.find((e) => e.id === id);
  if (!producto) {
    res.send({ error: "producto no encontrado" });
  }
  res.json(producto);
});
routerProductos.post("/", (req, res) => {
  const producto = req.body;
  productos.push(producto);
  const indice = productos.indexOf(producto);
  if (productos.length == 1) {
    producto.id = 1;
  } else {
    producto.id = productos[indice - 1]["id"] + 1;
  }
  res.json(producto);
});
routerProductos.put("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const productoNuevo = req.body;
  const productoViejo = productos.find((e) => e.id === id);
  if (!productoViejo) {
    res.send({ error: "producto no encontrado" });
  } else {
    //Este else lo agregue porque sino me tiraba el error en consola
    const indice = productos.indexOf(productoViejo);
    for (let key in productoNuevo) {
      if (productoNuevo.hasOwnProperty(key)) {
        productos[indice][key] = productoNuevo[key];
      }
    }
  }
});
routerProductos.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const producto = productos.find((e) => e.id === id);
  if (!producto) {
    res.json({ error: "producto no encontrado" });
  }
  productos = productos.filter((e) => e.id != id);
  res.json(productos);
});
app.use("/api/productos", routerProductos);
const PORT = 8080;
const server = app.listen(PORT, () =>
  console.log(`Servidor escuchando en el puerto ${PORT}`)
);
server.on("error", (error) => console.log("Hubo un error: " + error));
