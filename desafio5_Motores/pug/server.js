const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "pug");
app.set("views", `${__dirname}/views`);

const productos = [
  { nombre: "Amatista", precio: 30, thumbnail: "amatista.jpg" },
];

app.get("/productos", (req, res) => {
  res.render("inicio", { productos: productos });
});

app.post("/productos", (req, res) => {
  productos.push(req.body);
  res.redirect("/productos");
});
const PORT = 8080;
const server = app.listen(PORT, () =>
  console.log(`Servidor escuchando en el puerto ${PORT}`)
);
server.on("error", (error) => console.log("Hubo un error: " + error));
