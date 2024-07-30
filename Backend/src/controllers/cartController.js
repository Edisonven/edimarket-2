import jwt from "jsonwebtoken";
import "dotenv/config";

import { cartModel } from "../models/cartModel.js";

const añadirProductoCarrito = async (req, res) => {
  try {
    const producto = req.body;
    const Authorization = req.header("Authorization");
    const token = Authorization.split("Bearer ")[1];
    jwt.verify(token, process.env.JWT_SECRET);
    const { email, id } = jwt.decode(token);
    await cartModel.agregarCarrito(id, producto);
    console.log(
      `El usuario ${email} con el id ${id} ha agregado un producto al carrito`
    );
    res.status(201).json({ Mensaje: "Producto agregado al carrito" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCarrito = async (req, res) => {
  try {
    const Authorization = req.header("Authorization");
    const token = Authorization.split("Bearer ")[1];
    jwt.verify(token, process.env.JWT_SECRET);
    const { email, id } = jwt.decode(token);
    const carrito = await cartModel.consultarCarrito(id);
    console.log(`El usuario ${email} con el id ${id} ha consultado el carrito`);
    res.json(carrito);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteProductoCarrito = async (req, res) => {
  try {
    const { idProducto } = req.params;
    const Authorization = req.header("Authorization");
    const token = Authorization.split("Bearer ")[1];
    jwt.verify(token, process.env.JWT_SECRET);
    const { email, id } = jwt.decode(token);
    await cartModel.eliminarProducto(id, idProducto);
    console.log(
      `El usuario ${email} con el id ${id} ha eliminado un producto del carrito`
    );
    res.status(200).json({
      message: "Producto eliminado del carrito",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const modifyQuantityOfProductAdded = async (req, res) => {
  try {
    const { idProducto, quantity } = req.body;
    if (!quantity || !idProducto) {
      throw new Error("Uno o más parámetros no proporcionados");
    }
    const authorization = req.header("Authorization");
    const token = authorization.split("Bearer ")[1];
    jwt.verify(token, process.env.JWT_SECRET);
    const { id } = jwt.decode(token);
    await cartModel.quantityOfProductAddedModified(id, idProducto, quantity);
    res.status(200).json({ message: "Cantidad modificada" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const cartController = {
  getCarrito,
  añadirProductoCarrito,
  deleteProductoCarrito,
  modifyQuantityOfProductAdded,
};
