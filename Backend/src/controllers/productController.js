import { userModel } from "../models/userModel.js";
import { hateoasModel } from "../models/hateoasModel.js";
import { productModel } from "../models/productModel.js";
import jwt from "jsonwebtoken";

const getProductos = async (req, res) => {
  try {
    const { limits = 12, page = 1, order_by = "fecha_DESC" } = req.query;
    const productos = await userModel.consultarProductos(
      limits,
      page,
      order_by
    );
    const hateoas = await hateoasModel.prepHateoasProductos(
      productos.products,
      page,
      productos.productsAll
    );
    res.send(hateoas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const { limits, page = 1, order_by } = req.query;
    const productos = await productModel.allProducts(limits, page, order_by);
    res.send(productos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProductoById = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await productModel.consultarProductoById(id);
    res.send(producto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const agregarProducto = async (req, res) => {
  try {
    const producto = req.body;
    const Authorization = req.header("Authorization");
    const token = Authorization.split("Bearer ")[1];
    jwt.verify(token, process.env.JWT_SECRET);
    const { email, id } = jwt.decode(token);

    await productModel.registrarProducto(producto, id);

    console.log(
      `El usuario ${email} con el id ${id} ha registrado un producto`
    );
    res.status(201).json({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      estado: producto.estado,
      precio: producto.precio,
      stock: producto.stock,
      imagen: producto.imagen,
      categoria: producto.categoria,
      fecha: producto.fecha_producto,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const modifyProducto = async (req, res) => {
  try {
    const { idProducto } = req.params;
    const producto = req.body;
    const Authorization = req.header("Authorization");
    const token = Authorization.split("Bearer ")[1];
    jwt.verify(token, process.env.JWT_SECRET);
    const { email, id } = jwt.decode(token);
    await productModel.modificarProducto(id, idProducto, producto);
    console.log(
      `El usuario ${email} con el id ${id} ha modificado un producto`
    );
    res.status(200).json({
      message: "Producto modificado",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProductosByCategoria = async (req, res) => {
  try {
    const { categoria } = req.params;
    const { limits = 12, page = 1, order_by } = req.query;
    const productos = await userModel.consultarProductosByCategoria(
      categoria,
      limits,
      page,
      order_by
    );
    const hateoas = await hateoasModel.prepHateoasCategorias(
      productos.products,
      page,
      categoria,
      productos.productsAll
    );
    res.send(hateoas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const añadirProductoCarrito = async (req, res) => {
  try {
    const producto = req.body;
    const Authorization = req.header("Authorization");
    const token = Authorization.split("Bearer ")[1];
    jwt.verify(token, process.env.JWT_SECRET);
    const { email, id } = jwt.decode(token);
    await userModel.agregarCarrito(id, producto);
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
    const carrito = await userModel.consultarCarrito(id);
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
    await userModel.eliminarProducto(id, idProducto);
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

const ventaRealizada = async (req, res) => {
  try {
    const { idProducto, cantidad } = req.body;
    const Authorization = req.header("Authorization");
    const token = Authorization.split("Bearer ")[1];
    jwt.verify(token, process.env.JWT_SECRET);
    const { email, id } = jwt.decode(token);
    await productModel.venta(id, idProducto, cantidad);
    console.log(`El usuario ${email} ha realizado una compra`);
    res.status(200).json({ mensaje: "compra realizada" });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

const valorarProducto = async (req, res) => {
  try {
    const { idProducto, cantidad } = req.body;
    const Authorization = req.header("Authorization");
    const token = Authorization.split("Bearer ")[1];
    jwt.verify(token, process.env.JWT_SECRET);
    const { id } = jwt.decode(token);
    await productModel.valorate(id, idProducto, cantidad);
    res.status(200).json({ mensaje: "compra realizada" });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

const actualizarProductoValorado = async (req, res) => {
  try {
    const { orderId, score } = req.body;
    if (!orderId || !score) {
      throw new Error("id o calificación no proporcionados");
    }
    const Authorization = req.header("Authorization");
    const token = Authorization.split("Bearer ")[1];
    jwt.verify(token, process.env.JWT_SECRET);
    const { id } = jwt.decode(token);
    await productModel.editValorate(id, orderId, score);
    res.status(200).json({ mensaje: "producto actualizado" });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

const getPreguntasByProductId = async (req, res) => {
  try {
    const { idProduct } = req.params;
    console.log(idProduct);
    const preguntas = await productModel.preguntasByProductId(idProduct);
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

const getProductOnQuestions = async (req, res) => {
  try {
    const Authorization = req.header("Authorization");
    const token = Authorization.split("Bearer ")[1];
    jwt.verify(token, process.env.JWT_SECRET);
    const { id } = jwt.decode(token);

    const productos = await productModel.productOnQuestions(id);

    const productosConPreguntas = productos.reduce(
      (acumulador, elementoActual) => {
        const {
          producto_id,
          producto_nombre,
          precio,
          imagen,
          stock,
          nombre_usuario,
          id_pregunta,
          pregunta,
          fecha,
          usuario_id,
        } = elementoActual;

        const existingProduct = acumulador.find(
          (p) => p.producto_id === producto_id
        );

        if (existingProduct) {
          existingProduct.preguntas.push({
            id_pregunta,
            usuario_id,
            pregunta,
            fecha: fecha.toLocaleString("es-ES", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              timeZone: "UTC",
            }),
          });
        } else {
          acumulador.push({
            producto_id,
            titulo: producto_nombre,
            precio,
            imagen,
            stock,
            nombre_usuario,
            preguntas: [
              {
                id_pregunta,
                usuario_id,
                pregunta,
                fecha: fecha.toLocaleString("es-ES", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  timeZone: "UTC",
                }),
              },
            ],
          });
        }

        return acumulador;
      },
      []
    );

    res.json({ productos: productosConPreguntas });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

const sendProductValoration = async (req, res) => {
  try {
    const { idProducto, comentario, calificacion } = req.body;
    const Authorization = req.header("Authorization");
    const token = Authorization.split("Bearer ")[1];
    jwt.verify(token, process.env.JWT_SECRET);
    const { id } = jwt.decode(token);
    const valoracion = await productModel.productValoration(
      id,
      idProducto,
      comentario,
      calificacion
    );

    res.status(200).json({ mensaje: "valoración realizada" });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

export const productController = {
  getProductos,
  getProductoById,
  agregarProducto,
  añadirProductoCarrito,
  getProductosByCategoria,
  getCarrito,
  deleteProductoCarrito,
  ventaRealizada,
  modifyProducto,
  getAllProducts,
  getPreguntasByProductId,
  getProductOnQuestions,
  sendProductValoration,
  valorarProducto,
  actualizarProductoValorado,
};
