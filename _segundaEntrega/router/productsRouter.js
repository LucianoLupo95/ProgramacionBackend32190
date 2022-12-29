const express = require("express");
const { Router } = express;
const Container = require("../container");

const productsContainer = new Container("./persistencia/productos.txt");
const productsRouter = new Router();
const admin = true;

productsRouter.get("/:id?", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (id) {
      const producto = await productsContainer.getById(id);
      if (producto) {
        res.status(200).json(producto);
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
        res.status(204).send("Actualizado con éxito");
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
          res.status(204).json("Borrado con éxito");
        } else {
          res.status(422).json("No encontrado");
        }
      } else {
        try {
          const productos = await productsContainer.getAll(); //Este getAll es para poder chequear antes si hay productos
          if (productos.length > 0) {
            await productsContainer.deleteAll();
            res.status(200).json("Borrados todos los productos con éxito");
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

module.exports = { productsRouter, productsContainer };
