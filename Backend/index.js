import "dotenv/config";
import express, { json } from "express";
const app = express();
import cors from "cors";
import userRoutes from "./src/routes/userRoutes.js";
import categoriaRoutes from "./src/routes/categoriaRoutes.js";
import productRoutes from "./src/routes/productRoutes.js";
import favoritosRoutes from "./src/routes/favoritosRoutes.js";
import carritoRoutes from "./src/routes/carritoRoutes.js";
import ventaRoutes from "./src/routes/ventaRoutes.js";
import webPayPlusRoutes from "./src/routes/webPayPlusRoute.js";
const port = process.env.PORT || 3000;

app.use(cors());
app.use(json());

app.use("/usuarios", userRoutes);
app.use("/categorias", categoriaRoutes);
app.use("/productos", productRoutes);
app.use("/favoritos", favoritosRoutes);
app.use("/carrito", carritoRoutes);
app.use("/venta", ventaRoutes);
app.use("/preguntas", productRoutes);
app.use("/webpayplus", webPayPlusRoutes);

app.get("*", (_, res) => {
  res.status(404).send("Ruta no encontrada");
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
