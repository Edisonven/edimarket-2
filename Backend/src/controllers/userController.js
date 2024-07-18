import { userModel } from "../models/userModel.js";
import { productModel } from "../models/productModel.js";
import jwt from "jsonwebtoken";

const getAllUsers = async (req, res) => {
  try {
    const usuarios = await userModel.consultarUsuario();
    res.send(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await userModel.consultarUsuarioById(id);
    res.send(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const registrarUser = async (req, res) => {
  try {
    const usuario = req.body;
    await userModel.registrarUsuario(usuario);
    res.status(201).json({
      message: "Usuario registrado con exito",
      nombre: usuario.nombre,
      email: usuario.email,
      contraseña: usuario.contraseña,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, contraseña } = req.body;
    const user = await userModel.verificarUsuario(email, contraseña);
    const token = jwt.sign(
      { email: user.email, id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.status(200).json({
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const ModifyUser = async (req, res) => {
  try {
    const usuario = req.body;
    const Authorization = req.header("Authorization");
    const token = Authorization.split("Bearer ")[1];
    jwt.verify(token, process.env.JWT_SECRET);
    const { email, id } = jwt.decode(token);
    await userModel.modificarUsuario(id, usuario);
    console.log(`El usuario ${email} con el id ${id} ha sido modificado`);
    res.status(200).json({
      message: "Usuario modificado con exito",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const Authorization = req.header("Authorization");
    const token = Authorization.split("Bearer ")[1];
    jwt.verify(token, process.env.JWT_SECRET);
    const { email, id } = jwt.decode(token);
    await userModel.eliminarUsuario(id);
    console.log(`El usuario ${email} con el id ${id} ha sido eliminado`);
    res.status(200).json({
      message: "Usuario eliminado con exito",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const consultarCategoria = async (req, res) => {
  try {
    const categorias = await userModel.consultarCategorias();
    res.send(categorias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const consultarProductosPerUser = async (req, res) => {
  try {
    const Authorization = req.header("Authorization");
    const token = Authorization.split("Bearer ")[1];
    jwt.verify(token, process.env.JWT_SECRET);
    const { email, id } = jwt.decode(token);
    const productos = await userModel.consultarProductosPorUsuario(id);
    console.log(
      `El usuario ${email} con el id ${id} ha consultado sus productos`
    );
    res.json({
      productos: productos.map((producto) => {
        const fecha_producto = producto.fecha.toISOString().split("T")[0];
        return {
          usuario_: id,
          id: producto.id,
          productoId: producto.producto_id,
          nombre: producto.nombre,
          descripcion: producto.descripcion,
          estado: producto.estado,
          precio: producto.precio,
          stock: producto.stock,
          imagen: producto.imagen,
          categoria: producto.nombre_categoria,
          fecha: fecha_producto,
        };
      }),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const agregarDomicilio = async (req, res) => {
  try {
    const domicilio = req.body;
    const Authorization = req.header("Authorization");
    const token = Authorization.split("Bearer ")[1];
    jwt.verify(token, process.env.JWT_SECRET);
    const { email, id } = jwt.decode(token);
    await userModel.agregarDirreccion(domicilio, id);
    console.log(`El usuario ${email} con el id ${id} ha agregado un domicilio`);
    res.status(201).json({
      message: "Domicilio agregado",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const modificarDomicilio = async (req, res) => {
  try {
    const domicilio = req.body;
    const Authorization = req.header("Authorization");
    const token = Authorization.split("Bearer ")[1];
    jwt.verify(token, process.env.JWT_SECRET);
    const { email, id } = jwt.decode(token);
    await userModel.modificarDireccion(id, domicilio);
    console.log(
      `El usuario ${email} con el id ${id} ha modificado su domicilio`
    );
    res.status(200).json({
      message: "Domicilio modificado",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const agregarPaymentMethod = async (req, res) => {
  try {
    const metodoDePago = req.body;
    const Authorization = req.header("Authorization");
    const token = Authorization.split("Bearer ")[1];
    jwt.verify(token, process.env.JWT_SECRET);
    const { email, id } = jwt.decode(token);
    await userModel.agregarMetodoDePago(metodoDePago, id);
    console.log(
      `El usuario ${email} con el id ${id} ha agregado un metodo de pago`
    );
    res.status(201).json({
      message: "Metodo de pago agregado",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deletePaymentMethod = async (req, res) => {
  try {
    const { idMetodoDePago } = req.params;
    const Authorization = req.header("Authorization");
    const token = Authorization.split("Bearer ")[1];
    jwt.verify(token, process.env.JWT_SECRET);
    const { email, id } = jwt.decode(token);
    await userModel.eliminarMetodoDePago(idMetodoDePago, id);
    console.log(
      `El usuario ${email} con el id ${id} ha eliminado un metodo de pago`
    );
    res.status(200).json({
      message: "Metodo de pago eliminado",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const consultarPaymentMethods = async (req, res) => {
  try {
    const Authorization = req.header("Authorization");
    const token = Authorization.split("Bearer ")[1];
    jwt.verify(token, process.env.JWT_SECRET);
    const { email, id } = jwt.decode(token);
    const metodos = await userModel.consultarMetodosPago(id);
    console.log(
      `El usuario ${email} con el id ${id} ha consultado sus metodos de pago`
    );
    res.json({
      metodos: metodos.map((metodo) => {
        return {
          id: metodo.id,
          tipo_tarjeta: metodo.tipo_tarjeta,
          numero_tarjeta: metodo.numero_tarjeta,
          nombre_titular: metodo.nombre_titular,
          fecha_expiracion: metodo.fecha_expiracion,
          codigo_seguridad: metodo.codigo_seguridad,
        };
      }),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const consultarDomicilio = async (req, res) => {
  try {
    const Authorization = req.header("Authorization");
    const token = Authorization.split("Bearer ")[1];
    jwt.verify(token, process.env.JWT_SECRET);
    const { email, id } = jwt.decode(token);
    const domicilio = await userModel.consultarDirreccion(id);
    console.log(
      `El usuario ${email} con el id ${id} ha consultado su domicilio`
    );
    res.json({
      Domicilio: domicilio.map((domicilio) => {
        return {
          id: domicilio.id,
          direccion: domicilio.direccion,
          numero_casa: domicilio.numero_casa,
          ciudad: domicilio.ciudad,
          comuna: domicilio.comuna,
          region: domicilio.region,
          codigo_postal: domicilio.codigo_postal,
        };
      }),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteDomicilio = async (req, res) => {
  try {
    const { idDomicilio } = req.params;
    const Authorization = req.header("Authorization");
    const token = Authorization.split("Bearer ")[1];
    jwt.verify(token, process.env.JWT_SECRET);
    const { email, id } = jwt.decode(token);
    await userModel.eliminarDomicilio(id, idDomicilio);
    console.log(
      `El usuario ${email} con el id ${id} ha eliminado un domicilio`
    );
    res.status(200).json({
      message: "Domicilio eliminado",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addFavorito = async (req, res) => {
  try {
    const { producto_id } = req.params;
    const Authorization = req.header("Authorization");
    const token = Authorization.split("Bearer ")[1];
    jwt.verify(token, process.env.JWT_SECRET);
    const { email, id } = jwt.decode(token);
    await productModel.agregarFavorito(producto_id, id);
    const producto = await productModel.consultarProductoById(producto_id);
    console.log(
      `El usuario ${email} con el id ${id} ha agregado un producto a favoritos`
    );
    res.json({
      message: "Producto agregado",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const consultarFavorito = async (req, res) => {
  try {
    const Authorization = req.header("Authorization");
    const token = Authorization.split("Bearer ")[1];
    jwt.verify(token, process.env.JWT_SECRET);
    const { email, id } = jwt.decode(token);
    const favoritos = await productModel.consultarFavoritos(id);
    console.log(
      `El usuario ${email} con el id ${id} ha consultado sus favoritos`
    );
    res.json({
      favoritos: favoritos.map((favorito) => {
        return {
          id: favorito.favorito_id,
          nombre: favorito.nombre,
          descripcion: favorito.descripcion,
          precio: favorito.precio,
          stock: favorito.stock,
          imagen: favorito.imagen,
          categoria: favorito.categoria,
          producto_id: favorito.producto_id,
          usuario_id: id,
        };
      }),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteFav = async (req, res) => {
  try {
    const { idFavorito } = req.params;
    const Authorization = req.header("Authorization");
    const token = Authorization.split("Bearer ")[1];
    jwt.verify(token, process.env.JWT_SECRET);
    const { email, id } = jwt.decode(token);
    const favorito = await productModel.borrarFavorito(idFavorito, id);
    console.log(`El usuario ${email} con el id ${id} ha eliminado un favorito`);
    res.status(200).json({
      message: "Favorito eliminado",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteProductoDelUsuario = async (req, res) => {
  try {
    const { idProducto } = req.params;
    const Authorization = req.header("Authorization");
    const token = Authorization.split("Bearer ")[1];
    jwt.verify(token, process.env.JWT_SECRET);
    const { email, id } = jwt.decode(token);
    await userModel.eliminarProductoDelUsuario(id, idProducto);
    console.log(`El usuario ${email} con el id ${id} ha eliminado un producto`);
    res.status(200).json({
      message: "Producto eliminado",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const consultarVentas = async (req, res) => {
  try {
    const Authorization = req.header("Authorization");
    const token = Authorization.split("Bearer ")[1];
    jwt.verify(token, process.env.JWT_SECRET);
    const { email, id } = jwt.decode(token);
    const ventas = await userModel.consultarVentasUsuario(id);
    console.log(
      `El usuario ${email} con el id ${id} ha consultado sus compras`
    );
    res.json({
      ventas: ventas.map((venta) => {
        return {
          id: venta.id,
          comprador_id: venta.comprador_id,
          producto_id: venta.producto_id,
          nombre: venta.nombre,
          descripcion: venta.descripcion,
          imagen: venta.imagen,
          nombre_categoria: venta.nombre_categoria,
          cantidad: venta.cantidad,
          valor_total: venta.valor_total,
          fecha_venta: venta.fecha_venta.toLocaleString("es-ES", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            timeZone: "UTC",
          }),
        };
      }),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const consultarVentasParaValorar = async (req, res) => {
  try {
    const Authorization = req.header("Authorization");
    const token = Authorization.split("Bearer ")[1];
    jwt.verify(token, process.env.JWT_SECRET);
    const { email, id } = jwt.decode(token);
    const ventas = await userModel.consultarVentasUsuarioParaValorar(id);
    console.log(
      `El usuario ${email} con el id ${id} ha consultado sus compras`
    );
    res.json({
      ventasParaValorar: ventas.map((venta) => {
        return {
          calificacion: venta.calificacion,
          orderValorate_id: venta.order_id,
          venta_id: venta.id,
          comprador_id: venta.comprador_id,
          producto_id: venta.producto_id,
          nombre: venta.nombre,
          descripcion: venta.descripcion,
          imagen: venta.imagen,
          nombre_categoria: venta.nombre_categoria,
          cantidad: venta.cantidad,
          valor_total: venta.valor_total,
          fecha_venta: venta.fecha_venta.toLocaleString("es-ES", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            timeZone: "UTC",
          }),
          valorado: venta.valorado,
        };
      }),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const preguntaRealizada = async (req, res) => {
  try {
    const { idProducto, pregunta } = req.body;
    const Authorization = req.header("Authorization");
    const token = Authorization.split("Bearer ")[1];
    jwt.verify(token, process.env.JWT_SECRET);
    const { email, id } = jwt.decode(token);
    await userModel.pregunta(idProducto, id, pregunta);
    console.log(`El usuario ${email} ha realizado una pregunta`);
    res.status(200).json({ mensaje: "pregunta realizada" });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

const getPreguntas = async (req, res) => {
  try {
    const Authorization = req.header("Authorization");
    const token = Authorization.split("Bearer ")[1];
    jwt.verify(token, process.env.JWT_SECRET);
    const { email, id } = jwt.decode(token);
    const preguntas = await userModel.getPreguntasByUser(id);
    console.log(`El usuario ${email} ha consultado sus preguntas`);
    res.json({
      preguntas: preguntas.map((pregunta) => {
        return {
          id: pregunta.id,
          producto_id: pregunta.producto_id,
          usuario_id: pregunta.usuario_id,
          pregunta: pregunta.pregunta,
          fecha: pregunta.fecha,
        };
      }),
    });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

const modifyPreguntas = async (req, res) => {
  try {
    const { question, idPregunta } = req.body;
    const Authorization = req.header("Authorization");
    const token = Authorization.split("Bearer ")[1];
    jwt.verify(token, process.env.JWT_SECRET);
    const { email } = jwt.decode(token);
    await userModel.modifyPreguntasByUser(question, idPregunta);
    console.log(`El usuario ${email} ha modificado una pregunta`);
    res.status(200).json({
      message: "Pregunta modificada",
    });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

const deletePreguntas = async (req, res) => {
  try {
    const { productId } = req.params;
    const Authorization = req.header("Authorization");
    const token = Authorization.split("Bearer ")[1];
    jwt.verify(token, process.env.JWT_SECRET);
    const { id } = jwt.decode(token);
    await userModel.deletePreguntasByUser(productId, id);
    res.status(200).json({
      message: "Preguntas eliminadas",
    });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

export const userController = {
  getAllUsers,
  getUserById,
  registrarUser,
  loginUser,
  consultarCategoria,
  agregarDomicilio,
  consultarDomicilio,
  addFavorito,
  consultarFavorito,
  deleteFav,
  agregarPaymentMethod,
  consultarPaymentMethods,
  deleteUser,
  ModifyUser,
  consultarProductosPerUser,
  modificarDomicilio,
  deleteProductoDelUsuario,
  deletePaymentMethod,
  deleteDomicilio,
  consultarVentas,
  preguntaRealizada,
  getPreguntas,
  modifyPreguntas,
  deletePreguntas,
  consultarVentasParaValorar,
};
