const express = require("express");
const { Router } = express;
const Container = require("./container");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("json spaces", 2);

const productsContainer = new Container("./persistencia/productos.txt");
const cartContainer = new Container("./persistencia/carritos.txt");

const admin = true;

const productsRouter = new Router();
const cartRouter = new Router();

productsRouter.get("/:id?", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (id) {
      const producto = await productsContainer.getById(id);
      if (producto) {
        res.status(201).json(producto);
      } else {
        res.status(422).json("No encontrado");
      }
    } else {
      try {
        const productos = await productsContainer.getAll();
        res.status(201).json(productos);
      } catch {
        res.status(404).json({ err });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
});
productsRouter.post("/", async (req, res) => {
  try {
    if (admin) {
      const producto = req.body;
      await productsContainer.save(producto);
      res.status(201).send("Creado con éxito");
    } else {
      res
        .status(401)
        .send("No posees credenciales válidas para dicha operación");
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
});
productsRouter.put("/:id", async (req, res) => {
  try {
    if (admin) {
      const id = parseInt(req.params.id);
      const updatedProduct = req.body;
      const producto = await productsContainer.put(id, updatedProduct);
      if (producto) {
        res.status(201).send("Actualizado con éxito");
      } else {
        res.status(422).json("No encontrado");
      }
    } else {
      res
        .status(401)
        .send("No posees credenciales válidas para dicha operación");
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
});
productsRouter.delete("/:id?", async (req, res) => {
  try {
    if (admin) {
      const id = parseInt(req.params.id);
      if (id) {
        const producto = await productsContainer.getById(id); //Este get by ID es para poder chequear antes si existe, ya que my deleteById devuelve un array sin importar si se hizo el delete o no
        if (producto) {
          await productsContainer.deleteById(id);
          res.status(201).json("Borrado con éxito");
        } else {
          res.status(422).json("No encontrado");
        }
      } else {
        try {
          const productos = await productsContainer.getAll(); //Este getAll es para poder chequear antes si hay productos
          if (productos.length > 0) {
            await productsContainer.deleteAll();
            res.status(201).json("Borrados todos los productos con éxito");
          } else {
            res.status(422).json("No hay productos para eliminar");
          }
        } catch {
          res.status(404).json({ err });
        }
      }
    } else {
      res
        .status(401)
        .send("No posees credenciales válidas para dicha operación");
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
});

cartRouter.post("/", async (req, res) => {
  try {
    const id = await cartContainer.save({ productos: [] });
    res.status(201).json(id);
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
});
cartRouter.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (id) {
      const cart = await cartContainer.getById(id); //Este get by ID es para poder chequear antes si existe, ya que my deleteById devuelve un array sin importar si se hizo el delete o no
      if (cart) {
        await cartContainer.deleteById(id);
        res.status(201).json("Borrado con éxito");
      } else {
        res.status(422).json("No encontrado");
      }
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
});
cartRouter.get("/:id/productos", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const cart = await cartContainer.getById(id);
    if (cart) {
      res.status(201).json(cart);
    } else {
      res.status(422).json("No encontrado");
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
});
cartRouter.post("/:id/productos/:id_prod", async (req, res) => {
  try {
    const cartId = parseInt(req.params.id);
    const product = await productsContainer.getById(
      parseInt(req.params.id_prod)
    );
    if (product) {
      await cartContainer.fillCart(cartId, product);
      res.status(201).send("Creado con éxito");
    } else {
      res.status(422).json("No encontrado");
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
});
cartRouter.delete("/:id/productos/:id_prod", async (req, res) => {
  try {
    const cartId = parseInt(req.params.id);
    const prodID = parseInt(req.params.id_prod);
    const product = await productsContainer.getById(prodID);
    const cart = await cartContainer.getById(cartId);
    if (product && cart) {
      const found = await cartContainer.deleteProduct(cartId, prodID);
      if (found) {
        res.status(201).json("Borrado con éxito");
      } else {
        res.status(422).json("El producto no está en el carrito");
      }
    } else {
      res.status(422).json("No encontrado");
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
});

app.use("/api/productos", productsRouter);
app.use("/api/carrito", cartRouter);
const PORT = process.env.port || 8080;
const server = app.listen(PORT, () =>
  console.log(`Servidor escuchando en el puerto ${PORT}`)
);
server.on("error", (error) => console.log("Hubo un error: " + error));
