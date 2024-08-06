import { userModel } from "../models/userModel.js";
import { hateoasModel } from "../models/hateoasModel.js";
import { productModel } from "../models/productModel.js";
import jwt from "jsonwebtoken";
import "dotenv/config";

const getProductos = async (req, res) => {
  try {
    const { limits = 12, page = 1, order_by = "fecha_DESC" } = req.query;
    const productos = await productModel.consultarProductos(
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

const getProductValoration = async (req, res) => {
  try {
    const { productId } = req.params;
    const valoraciones = await productModel.productValorationObtained(
      productId
    );
    console.log(valoraciones);
    res.status(200).json({
      valoraciones: valoraciones.map((valoracion) => {
        return {
          id: valoracion.id,
          valoracion: valoracion.valoracion,
          usuario_id: valoracion.usuario_id,
          comentario: valoracion.comentario,
          calificacion: valoracion.calificacion,
          usuario: valoracion.nombre_usuario,
          producto_id: valoracion.producto_id,
          fecha: valoracion.fecha.toLocaleString("es-ES", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            timeZone: "UTC",
          }),
        };
      }),
    });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

const updateStockInProduct = async (req, res) => {
  try {
    const { productId, newStock } = req.body;
    if (productId === "" || newStock === "") {
      throw new Error("id de producto o stock no proporcionados");
    }
    const Authorization = req.header("Authorization");
    const token = Authorization.split("Bearer ")[1];
    jwt.verify(token, process.env.JWT_SECRET);
    await productModel.setStockInProduct(productId, newStock);
    res.status(200).json({ message: "stock actualizado con éxito" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const sendProductValorationEdited = async (req, res) => {
  try {
    const { idProducto, comentario, calificacion } = req.body;
    if (!idProducto || !calificacion) {
      throw new Error("Id de producto o calificación no proporcionados");
    }
    const Authorization = req.header("Authorization");
    const token = Authorization.split("Bearer ")[1];
    jwt.verify(token, process.env.JWT_SECRET);
    const { id } = jwt.decode(token);
    await productModel.productValorationEdited(
      id,
      idProducto,
      comentario,
      calificacion
    );

    res.status(200).json({ mensaje: "valoración actualizada" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const sendCalificationOfValorate = async (req, res) => {
  try {
    const { productId, calificacionId, positiva, negativa } = req.body;
    if (!productId || !positiva || !calificacionId) {
      throw new Error("Uno de los parametros no fue proporcionado");
    }

    const Authorization = req.header("Authorization");
    const token = Authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET);
    const { id } = jwt.decode(token);
    await productModel.calificationOfValorate(
      id,
      productId,
      calificacionId,
      positiva,
      negativa
    );
    res.status(200).json({ message: "calificación enviada exitosamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCalificationOfValorate = async (req, res) => {
  try {
    const { productId } = req.params;
    const calificaciones = await productModel.calificationOfValorateObtained(
      productId
    );
    res.status(200).json(calificaciones);
  } catch (error) {
    res.status(500).json({ message: "error al obtener calificaciones" });
  }
};

const updateCalificationOfValorate = async (req, res) => {
  try {
    const { calificacion, calificationId } = req.body;
    if (calificacion === "" || !calificationId) {
      throw new Error("Uno de los parametros no fue proporcionado");
    }

    const Authorization = req.header("Authorization");
    const token = Authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET);
    const { id } = jwt.decode(token);
    await productModel.calificationOfValorateUpdated(
      calificacion,
      calificationId,
      id
    );
    res.status(200).json({ message: "Calificación actualizada" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getProductsInOfert = async (req, res) => {
  try {
    const products = await productModel.productsInOfert();
    const formattedProducts = products.map((product) => {
      return {
        ...product,
        precio_oferta: product.precio_oferta.toLocaleString("es-CL", {
          style: "currency",
          currency: "CLP",
        }),
      };
    });

    res.status(200).json(formattedProducts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obterner productos con descuento" });
  }
};

const getLikesFromMyCalifications = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!productId) {
      throw new Error("Parámetro no proporcionado");
    }
    const Authorization = req.header("Authorization");
    const token = Authorization.split("Bearer ")[1];
    jwt.verify(token, process.env.JWT_SECRET);
    const { id } = jwt.decode(token);
    const likes = await productModel.likesFromMyCalifications(productId, id);
    res.status(200).json(likes);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const productController = {
  getProductos,
  getProductoById,
  agregarProducto,
  getProductosByCategoria,
  ventaRealizada,
  modifyProducto,
  getAllProducts,
  getPreguntasByProductId,
  getProductOnQuestions,
  sendProductValoration,
  valorarProducto,
  actualizarProductoValorado,
  getProductValoration,
  updateStockInProduct,
  sendProductValorationEdited,
  sendCalificationOfValorate,
  getCalificationOfValorate,
  updateCalificationOfValorate,
  getProductsInOfert,
  getLikesFromMyCalifications,
};
