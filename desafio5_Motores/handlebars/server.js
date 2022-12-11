const express = require("express");
const handlebars = require("express-handlebars");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "handlebars");
app.engine(
  "handlebars",
  handlebars.engine({
    layoutsDir: `${__dirname}/views/layouts/`,
  })
);
const productos = [];

app.get("/productos", (req, res) => {
  res.render("formulario", { layout: "inicio", productos: productos });
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
