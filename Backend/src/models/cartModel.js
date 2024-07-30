import db from "../config/database.js";

const agregarCarrito = async (idUsuario, producto) => {
  let { idProducto, cantidad } = producto;
  const carrito = await consultarCarrito(idUsuario);
  if (carrito.find((carrito) => carrito.producto_id == idProducto)) {
    throw new Error("El producto ya está en el carrito");
  } else {
    const values = [idUsuario, idProducto, cantidad];
    const consulta =
      "INSERT INTO carrito(id,usuario_id,producto_id,cantidad,comprado) VALUES (DEFAULT,$1,$2,$3,false)";
    await db.query(consulta, values);
    return console.log("Producto agregado al carrito");
  }
};

const consultarCarrito = async (idUsuario) => {
  const values = [idUsuario];
  const consulta =
    "SELECT carrito.id AS carro_id, carrito.usuario_id, carrito.producto_id, carrito.cantidad, carrito.comprado, productos.id AS producto_id, productos.nombre, productos.descripcion, productos.precio, productos.stock, productos.imagen, productos.vendedor_id, productos.estado, ofertas.id AS ofertas_id, ofertas.preciooferta AS precio_oferta, ofertas.descuentoporcentaje AS descuento_aplicado FROM carrito INNER JOIN productos ON carrito.producto_id = productos.id LEFT JOIN ofertas ON carrito.producto_id = ofertas.producto_id WHERE carrito.usuario_id=$1";
  const { rows: carrito } = await db.query(consulta, values);
  return carrito;
};

const eliminarProducto = async (idUsuario, idProducto) => {
  const values = [idUsuario, idProducto];
  const consulta = "DELETE FROM carrito WHERE usuario_id=$1 AND producto_id=$2";
  await db.query(consulta, values);
  return console.log("Producto eliminado del carrito");
};

export const cartModel = {
  agregarCarrito,
  eliminarProducto,
  consultarCarrito,
};
