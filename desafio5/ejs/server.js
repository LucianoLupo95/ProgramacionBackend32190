const express = require("express");
const app = express();
const productos = [];
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");

app.get("/productos", (req, res) => {
  res.render("inicio", { productos });
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
