const express = require("express");
const { Router } = express;
const Container = require("../container");

const cartContainer = new Container("./persistencia/carritos.txt");
const cartRouter = new Router();

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
module.exports = cartRouter;
