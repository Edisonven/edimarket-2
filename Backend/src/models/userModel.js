import { object, string, number } from "zod";
import bcrypt from "bcryptjs";
import db from "../config/database.js";

const validarUsuario = object({
  nombre: string().min(3),
  email: string().email(),
  contraseña: string().min(8),
});
const validarUser = object({
  email: string().email(),
  contraseña: string().min(8),
});

const validarDomicilio = object({
  direccion: string().min(3),
  ciudad: string().min(3),
  region: string().min(3),
  codigo_postal: string().min(3),
  numero_casa: string().min(0),
  comuna: string().min(3),
});

const validarMetodoDePago = object({
  tipo_tarjeta: string().min(3),
  numero_tarjeta: string().min(3),
  nombre_titular: string().min(3),
  fecha_expiracion: string().min(3),
  codigo_seguridad: string().min(3),
});

const validarPregunta = object({
  question: string().min(3),
});

const consultarUsuario = async () => {
  const consulta = "SELECT * FROM usuarios";
  const { rows: users } = await db.query(consulta);
  return users;
};
const consultarUsuarioById = async (id) => {
  const consulta = "SELECT * FROM usuarios WHERE id=$1";
  const { rows: users } = await db.query(consulta, [id]);
  return users[0];
};

const userByTokenRegistered = async (id) => {
  const values = [id];
  const query = "SELECT nombre ,email,id FROM usuarios WHERE id = $1";
  const { rows: userFinded } = await db.query(query, values);
  return userFinded;
};

const modificarUsuario = async (id, usuario) => {
  let { nombre, contraseña } = usuario;
  const hashedPassword = bcrypt.hashSync(contraseña);
  contraseña = hashedPassword;
  const values = [id, nombre, hashedPassword];
  const consulta = "UPDATE usuarios SET nombre=$2, contraseña=$3 WHERE id=$1";
  await db.query(consulta, values);
  return console.log("Usuario modificado");
};

const registrarUsuario = async (usuario) => {
  try {
    const databaseUser = await consultarUsuario();
    let { nombre, email, contraseña } = usuario;

    if (databaseUser.find((user) => user.email === email)) {
      throw new Error("El usuario ya existe");
    }
    const parsedUser = validarUsuario.parse(usuario);

    let hashedPassword = contraseña;

    if (contraseña) {
      hashedPassword = bcrypt.hashSync(contraseña);
    }

    const values = [parsedUser.nombre, parsedUser.email, hashedPassword];
    const consulta =
      "INSERT INTO usuarios (id,nombre, email, contraseña) VALUES (DEFAULT, $1, $2, $3) RETURNING id, nombre, email";
    const {
      rows: [user],
    } = await db.query(consulta, values);
    return user;
  } catch (error) {
    console.error("Error in registrarUsuario", error);
    throw error;
  }
};

const eliminarUsuario = async (id) => {
  const values = [id];
  const consulta = "DELETE FROM usuarios WHERE id=$1";
  await db.query(consulta, values);
  return console.log("Usuario eliminado");
};

const verificarUsuario = async (email, contraseña, isGoogleAuth = false) => {
  try {
    const values = [email];
    if (!isGoogleAuth) {
      validarUser.parse({ email, contraseña });
    }
    const consulta = "SELECT * FROM usuarios WHERE email=$1";
    const { rows } = await db.query(consulta, values);
    if (rows.length === 0) {
      // Si no se encuentra el usuario, devolver null
      return null;
    }
    const user = rows[0];

    if (!isGoogleAuth) {
      const passwordVerified = bcrypt.compareSync(contraseña, user.contraseña);
      if (!passwordVerified) {
        throw { code: 401, message: "El usuario o contraseña no coinciden" };
      }
    }
    return user;
  } catch (error) {
    console.error("Error in verificarUsuario", error);
    throw error;
  }
};
const consultarProductos = async (limits, page, order_by) => {
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
  const consultaAllProducts =
    "SELECT productos.*, nombre_categoria, categorias.id AS categoria_id, ofertas.precioOferta AS precio_oferta FROM productos INNER JOIN producto_categoria ON productos.id=producto_categoria.producto_id INNER JOIN categorias ON producto_categoria.categoria_id=categorias.id LEFT JOIN ofertas ON productos.id = ofertas.producto_id";

  const consulta = `SELECT productos.*, nombre_categoria, categorias.id AS categoria_id, ofertas.precioOferta AS precio_oferta FROM productos INNER JOIN producto_categoria ON productos.id=producto_categoria.producto_id INNER JOIN categorias ON producto_categoria.categoria_id=categorias.id LEFT JOIN ofertas ON productos.id = ofertas.producto_id ${querys}`;
  const { rows: products } = await db.query(consulta);
  const { rows: productsAll } = await db.query(consultaAllProducts);
  return { products, productsAll };
};

const consultarProductosByCategoria = async (
  categoria,
  limits,
  page,
  order_by
) => {
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
  const values = [categoria];
  const consultaAllProductsPerCategory =
    "SELECT * from productos inner join producto_categoria on productos.id=producto_categoria.producto_id inner join categorias on producto_categoria.categoria_id=categorias.id where categorias.nombre_categoria=$1";
  const consulta = `SELECT * from productos inner join producto_categoria on productos.id=producto_categoria.producto_id inner join categorias on producto_categoria.categoria_id=categorias.id where categorias.nombre_categoria=$1 ${querys}`;
  const { rows: products } = await db.query(consulta, values);
  const { rows: productsAll } = await db.query(
    consultaAllProductsPerCategory,
    values
  );
  return { products, productsAll };
};

const consultarProductosPorUsuario = async (idUsuario) => {
  const values = [idUsuario];
  const consulta =
    "select * from productos inner join producto_categoria on productos.id=producto_categoria.producto_id inner join categorias on producto_categoria.categoria_id=categorias.id where vendedor_id=$1";
  const { rows: products } = await db.query(consulta, values);
  return products;
};

const consultarCategorias = async () => {
  const consulta = "SELECT * FROM categorias";
  const { rows: categorias } = await db.query(consulta);
  return categorias;
};

const eliminarProductoDelUsuario = async (idUsuario, idProducto) => {
  const values = [idUsuario, idProducto];
  const consulta = "DELETE FROM productos WHERE vendedor_id=$1 AND id=$2";
  await db.query(consulta, values);
  return console.log("Producto eliminado del usuario");
};

const agregarDirreccion = async (domicilio, idUsuario) => {
  const domicilios = await consultarDirreccion(idUsuario);
  if (domicilios.length > 2) {
    throw new Error("Superó el número máximo de direcciones");
  } else {
    let { direccion, numero_casa, ciudad, comuna, region, codigo_postal } =
      domicilio;
    validarDomicilio.parse(domicilio);
    const values = [
      idUsuario,
      direccion,
      numero_casa,
      ciudad,
      comuna,
      region,
      codigo_postal,
    ];
    const consulta =
      "INSERT INTO domicilio(id,usuario_id,direccion,ciudad,region,codigo_postal,comuna,numero_casa) VALUES (DEFAULT,$1,$2,$4,$6,$7,$5,$3)";
    await db.query(consulta, values);
    return console.log("Direccion agregada");
  }
};

const modificarDireccion = async (idUsuario, domicilio) => {
  let { direccion, numero_casa, ciudad, comuna, region, codigo_postal } =
    domicilio;
  validarDomicilio.parse(domicilio);
  const values = [
    direccion,
    numero_casa,
    ciudad,
    comuna,
    region,
    codigo_postal,
    idUsuario,
  ];
  const consulta =
    "UPDATE domicilio SET direccion=$1,ciudad=$3,region=$5,codigo_postal=$6,comuna=$4,numero_casa=$2 WHERE usuario_id=$7";
  await db.query(consulta, values);
  return console.log("Direccion modificada");
};

const eliminarDomicilio = async (idUsuario, idDomicilio) => {
  const values = [idUsuario, idDomicilio];
  const consulta = "DELETE FROM domicilio WHERE usuario_id=$1 AND id=$2";
  await db.query(consulta, values);
  return console.log("Domicilio eliminado");
};

const agregarMetodoDePago = async (metodoDePago, idUsuario) => {
  let {
    tipo_tarjeta,
    numero_tarjeta,
    nombre_titular,
    fecha_expiracion,
    codigo_seguridad,
  } = metodoDePago;
  const values = [
    idUsuario,
    tipo_tarjeta,
    numero_tarjeta,
    nombre_titular,
    fecha_expiracion,
    codigo_seguridad,
  ];
  validarMetodoDePago.parse(metodoDePago);
  const metodos = await consultarMetodosPago(idUsuario);
  if (metodos.find((metodo) => metodo.numero_tarjeta == numero_tarjeta)) {
    throw new Error(
      "Ya existe un metodo de pago con el mismo numero de tarjeta"
    );
  }
  const consulta =
    "INSERT INTO metodos_pago(id,usuario_id,tipo_tarjeta,numero_tarjeta,nombre_titular,fecha_expiracion,codigo_seguridad) VALUES (DEFAULT,$1,$2,$3,$4,$5,$6)";
  await db.query(consulta, values);
  return console.log("Metodo de pago agregado");
};

const eliminarMetodoDePago = async (idMetodoDePago, idUsuario) => {
  const values = [idMetodoDePago, idUsuario];
  const consulta = "DELETE FROM metodos_pago WHERE id=$1 AND usuario_id=$2";
  await db.query(consulta, values);
  return console.log("Metodo de pago eliminado");
};

const consultarMetodosPago = async (idUsuario) => {
  const values = [idUsuario];
  const consulta =
    "select * from usuarios inner join metodos_pago on usuarios.id=metodos_pago.usuario_id where usuarios.id=$1";
  const { rows: metodos } = await db.query(consulta, values);
  return metodos;
};

const consultarDirreccion = async (idUsuario) => {
  const values = [idUsuario];
  const consulta =
    "select * from usuarios inner join domicilio on usuarios.id=domicilio.usuario_id where usuarios.id=$1";
  const { rows: domicilio } = await db.query(consulta, values);
  return domicilio;
};

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
    "select carrito.id as carro_id, carrito.usuario_id,carrito.producto_id,carrito.cantidad,carrito.comprado, productos.id as producto_id, productos.nombre,productos.descripcion,productos.precio,productos.stock,productos.imagen,productos.vendedor_id,productos.estado from carrito inner join productos on carrito.producto_id=productos.id where carrito.usuario_id=$1";
  const { rows: carrito } = await db.query(consulta, values);
  return carrito;
};

const eliminarProducto = async (idUsuario, idProducto) => {
  const values = [idUsuario, idProducto];
  const consulta = "DELETE FROM carrito WHERE usuario_id=$1 AND producto_id=$2";
  await db.query(consulta, values);
  return console.log("Producto eliminado del carrito");
};

const consultarVentasUsuario = async (idUsuario) => {
  const values = [idUsuario];
  const consulta =
    "select * from ventas inner join productos on ventas.producto_id=productos.id inner join producto_categoria on productos.id=producto_categoria.producto_id inner join categorias on categorias.id=producto_categoria.categoria_id where ventas.comprador_id=$1";
  const { rows: ventas } = await db.query(consulta, values);
  console.log(ventas);
  return ventas;
};

const consultarVentasUsuarioParaValorar = async (idUsuario) => {
  const values = [idUsuario];
  const consulta =
    "SELECT orders_valorate.*, orders_valorate.id AS order_id, productos.*, producto_categoria.*, categorias.* FROM orders_valorate INNER JOIN productos ON orders_valorate.producto_id = productos.id INNER JOIN producto_categoria ON productos.id = producto_categoria.producto_id INNER JOIN categorias ON categorias.id = producto_categoria.categoria_id WHERE orders_valorate.comprador_id = $1";
  const { rows: ventas } = await db.query(consulta, values);
  console.log(ventas);
  return ventas;
};

const pregunta = async (idProducto, idUsuario, pregunta) => {
  const values = [idProducto, idUsuario, pregunta];
  const query =
    "INSERT INTO preguntas_producto (id, producto_id , usuario_id , pregunta, fecha) VALUES (DEFAULT , $1 ,$2 ,$3, DEFAULT)";
  await db.query(query, values);
  return console.log("pregunta enviada");
};

const getPreguntasByUser = async (idUsuario) => {
  const values = [idUsuario];
  const query = "SELECT * FROM preguntas_producto WHERE usuario_id = $1";
  const { rows: preguntas } = await db.query(query, values);
  console.log(preguntas);
  return preguntas;
};

const modifyPreguntasByUser = async (question, idPregunta) => {
  validarPregunta.parse({ question });
  const values = [question, idPregunta];
  const query = "UPDATE preguntas_producto SET pregunta=$1 WHERE id=$2";
  const { rows: preguntas } = await db.query(query, values);
  console.log(preguntas);
  return preguntas;
};

const deletePreguntasByUser = async (productId, id) => {
  const values = [productId, id];
  const query =
    "DELETE FROM preguntas_producto WHERE producto_id = $1 AND usuario_id = $2";
  await db.query(query, values);
  return console.log("preguntas elimidanas");
};

export const userModel = {
  consultarUsuario,
  consultarUsuarioById,
  registrarUsuario,
  consultarCategorias,
  consultarProductos,
  verificarUsuario,
  agregarDirreccion,
  consultarDirreccion,
  agregarMetodoDePago,
  consultarMetodosPago,
  eliminarUsuario,
  agregarCarrito,
  consultarProductosByCategoria,
  consultarCarrito,
  eliminarProducto,
  modificarUsuario,
  consultarProductosPorUsuario,
  modificarDireccion,
  eliminarProductoDelUsuario,
  eliminarMetodoDePago,
  eliminarDomicilio,
  consultarVentasUsuario,
  pregunta,
  getPreguntasByUser,
  modifyPreguntasByUser,
  deletePreguntasByUser,
  consultarVentasUsuarioParaValorar,
  userByTokenRegistered,
};
