import { query } from "express";
import db from "../config/database.js";
import { object, string, number } from "zod";

const validarProducto = object({
  nombre: string().min(3),
  descripcion: string().min(0),
  precio: number().min(0),
  stock: number().min(0),
  imagen: string().min(3),
  categoria: string().min(3),
});

const allProducts = async (limits, page, order_by) => {
  let querys = "";
  if (order_by) {
    const [campo, ordenamiention] = order_by.split("_");
    querys += ` ORDER BY ${campo} ${ordenamiention}`;
  }
  if (limits) {
    querys += ` LIMIT ${limits}`;
  }
  if (page && limits) {
    const offset = page * limits - limits;
    querys += ` OFFSET ${offset}`;
  }
  const consultaAllProducts = `SELECT * from productos inner join producto_categoria on productos.id=producto_categoria.producto_id inner join categorias on producto_categoria.categoria_id=categorias.id ${querys}`;
  const { rows: products } = await db.query(consultaAllProducts);
  return products;
};

const consultarProductoById = async (id) => {
  const consulta =
    "select * from productos inner join producto_categoria on productos.id=producto_categoria.producto_id inner join categorias on categorias.id=producto_categoria.categoria_id where productos.id=$1";
  const { rows: products } = await db.query(consulta, [id]);
  return products[0];
};

const venta = async (IdUsuario, IdProducto, cantidad) => {
  const producto = await consultarProductoById(IdProducto);
  const valor_total = producto.precio * cantidad;
  const values = [IdUsuario, IdProducto, cantidad, valor_total];
  const consulta =
    "INSERT INTO ventas(id,comprador_id,producto_id,cantidad,valor_total,fecha_venta) VALUES (DEFAULT,$1,$2,$3,$4,now())";
  await db.query(consulta, values);
  return console.log("Compra realizada");
};

const valorate = async (IdUsuario, IdProducto, cantidad) => {
  const producto = await consultarProductoById(IdProducto);
  const valor_total = producto.precio * cantidad;
  const values = [IdUsuario, IdProducto, cantidad, valor_total];
  const consulta =
    "INSERT INTO orders_valorate(id,comprador_id,producto_id,cantidad,valor_total,fecha_venta,valorado) VALUES (DEFAULT,$1,$2,$3,$4,now(),false)";
  await db.query(consulta, values);
  return console.log("Compra realizada");
};

const editValorate = async (id, orderId, score, valorado = true) => {
  const values = [id, orderId, score, valorado];
  const consulta =
    "UPDATE orders_valorate SET valorado = $4, calificacion = $3 WHERE comprador_id = $1 AND id = $2";
  await db.query(consulta, values);
  return console.log("producto actualizado");
};

const idCategoria = async (categoria) => {
  const values = [categoria];
  const consulta = "SELECT id FROM categorias WHERE nombre_categoria = $1";
  const { rows } = await db.query(consulta, values);
  return rows[0].id;
};

const registrarProducto = async (producto, vendedor_id) => {
  const { nombre, descripcion, estado, precio, stock, imagen, categoria } =
    producto;
  validarProducto.parse(producto);
  try {
    const categoriaId = await idCategoria(categoria);
    const valuesProducto = [
      nombre,
      descripcion,
      precio,
      stock,
      imagen,
      vendedor_id,
      estado,
    ];
    const consultaProducto =
      "INSERT INTO productos (nombre, descripcion, precio, stock, imagen, vendedor_id, estado, fecha) VALUES ($1, $2, $3, $4, $5, $6, $7, DEFAULT) RETURNING id";
    const { rows } = await db.query(consultaProducto, valuesProducto);
    const productoId = rows[0].id;
    const valuesCategoria = [productoId, categoriaId];
    const consultaCategoria =
      "INSERT INTO producto_categoria (producto_id, categoria_id) VALUES ($1, $2)";

    await db.query(consultaCategoria, valuesCategoria);
    console.log("Producto registrado correctamente");
  } catch (error) {
    console.error("Error al registrar el producto:", error.message);
  }
};

const modificarProducto = async (idUsuario, idProducto, producto) => {
  let { nombre, descripcion, estado, precio, stock, imagen } = producto;
  const values = [
    nombre,
    descripcion,
    estado,
    precio,
    stock,
    imagen,
    idUsuario,
    idProducto,
  ];
  const consulta =
    "UPDATE productos SET nombre=$1,descripcion=$2,precio=$4,stock=$5,imagen=$6,estado=$3 WHERE vendedor_id=$7 AND id=$8";
  await db.query(consulta, values);
  return console.log("Producto modificado");
};

const consultarFavoritos = async (idUsuario) => {
  const values = [idUsuario];
  const consulta =
    "select * from usuarios inner join favoritos on usuarios.id=favoritos.usuario_id inner join productos on productos.id=favoritos.producto_id where usuarios.id=$1";
  const { rows: favoritos } = await db.query(consulta, values);
  return favoritos;
};

const agregarFavorito = async (idProducto, idUsuario) => {
  const values = [idUsuario, idProducto];
  const favoritos = await consultarFavoritos(idUsuario);
  if (favoritos.find((favorito) => favorito.producto_id == idProducto)) {
    throw new Error("El producto ya está en favoritos");
  }
  const consulta =
    "INSERT INTO favoritos(favorito_id,usuario_id,producto_id) VALUES (DEFAULT,$1,$2)";
  await db.query(consulta, values);
  return console.log("Favorito agregado");
};

const borrarFavorito = async (idFavorito, idUsuario) => {
  const values = [idFavorito, idUsuario];
  const favoritos = await consultarFavoritos(idUsuario);
  if (favoritos.find((favorito) => favorito.favorito_id == idFavorito)) {
    const consulta =
      "DELETE FROM favoritos WHERE favorito_id=$1 AND usuario_id=$2";
    await db.query(consulta, values);
    return console.log("Favorito eliminado");
  } else {
    throw new Error("El favorito no existe");
  }
};

const preguntasByProductId = async (idProduct) => {
  const values = [idProduct];
  const query =
    "SELECT * FROM preguntas_producto WHERE producto_id = $1 ORDER BY fecha DESC";
  const { rows: preguntas } = await db.query(query, values);
  return preguntas;
};

const productOnQuestions = async (id) => {
  const values = [id];
  const query =
    "SELECT preguntas_producto.id AS id_pregunta, preguntas_producto.producto_id, preguntas_producto.usuario_id, preguntas_producto.pregunta, preguntas_producto.fecha, productos.id AS productoId, productos.nombre AS producto_nombre, productos.precio, productos.stock, productos.imagen, usuarios.nombre AS nombre_usuario FROM preguntas_producto INNER JOIN productos ON preguntas_producto.producto_id = productos.id INNER JOIN usuarios ON usuarios.id = preguntas_producto.usuario_id WHERE usuarios.id = $1";
  const { rows: producto } = await db.query(query, values);
  return producto;
};

const productValoration = async (id, idProducto, comentario, calificacion) => {
  const values = [id, idProducto, comentario, calificacion];
  const query =
    "INSERT INTO valoraciones_producto(id, usuario_id, producto_id, comentario, calificacion, fecha, valorado) VALUES (DEFAULT, $1 , $2 , $3 , $4 , DEFAULT, true)";
  const { rows: valoracion } = await db.query(query, values);
  return valoracion;
};

const productValorationObtained = async (productId) => {
  const values = [productId];
  const query =
    "SELECT valoraciones_producto.*, usuarios.nombre AS nombre_usuario, usuarios.email AS usuario_email FROM valoraciones_producto INNER JOIN usuarios ON valoraciones_producto.usuario_id = usuarios.id WHERE producto_id = $1";
  const { rows: valoracion } = await db.query(query, values);
  return valoracion;
};

const setStockInProduct = async (productId, newStock) => {
  const values = [productId, newStock];
  const query = "UPDATE productos SET stock = $2 WHERE id = $1";
  const { rows: newProduct } = await db.query(query, values);
  return newProduct;
};

const productValorationEdited = async (
  id,
  idProducto,
  comentario,
  calificacion
) => {
  const values = [id, idProducto, comentario, calificacion];
  const query =
    "UPDATE valoraciones_producto SET comentario = $3, calificacion = $4 WHERE usuario_id = $1 AND producto_id = $2";
  const { rows: newProductValorated } = await db.query(query, values);
  return newProductValorated;
};

const calificationOfValorateObtained = async (productId) => {
  const values = [productId];
  const query = "SELECT * FROM calificar_valoraciones WHERE producto_id = $1";
  const { rows: calificaciones } = await db.query(query, values);
  return calificaciones;
};

const calificationOfValorate = async (
  id,
  productId,
  calificacionId,
  positiva,
  negativa = false
) => {
  const calificationExists = await calificationOfValorateObtained(productId);
  const calificationFinded = calificationExists.find(
    (cal) => cal.calificacion_id === calificacionId
  );
  if (calificationFinded.calificacion_id) {
    throw new Error("ya existe una calificación positiva para este producto");
  }
  const values = [id, productId, calificacionId, positiva, negativa];
  const query =
    "INSERT INTO calificar_valoraciones (id, producto_id, usuario_id, calificacion_id ,positiva, negativa, fecha) VALUES (DEFAULT, $2, $1, $3, $4, $5, DEFAULT)";
  const { rows: calificationSended } = await db.query(query, values);
  return calificationSended;
};

export const productModel = {
  modificarProducto,
  venta,
  allProducts,
  consultarProductoById,
  registrarProducto,
  agregarFavorito,
  borrarFavorito,
  consultarFavoritos,
  preguntasByProductId,
  productOnQuestions,
  productValoration,
  valorate,
  editValorate,
  productValorationObtained,
  setStockInProduct,
  productValorationEdited,
  calificationOfValorate,
  calificationOfValorateObtained,
};
