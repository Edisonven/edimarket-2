import "dotenv/config";
import express, { json } from "express";
import cors from "cors";
import multer from "multer";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

import userRoutes from "./src/routes/userRoutes.js";
import categoriaRoutes from "./src/routes/categoriaRoutes.js";
import productRoutes from "./src/routes/productRoutes.js";
import favoritosRoutes from "./src/routes/favoritosRoutes.js";
import carritoRoutes from "./src/routes/carritoRoutes.js";
import ventaRoutes from "./src/routes/ventaRoutes.js";

const app = express();
const port = process.env.PORT || 3000;
const CURRENT_DIR = dirname(fileURLToPath(import.meta.url));

app.use(cors());
app.use(json());

const upload = multer({
  dest: join(CURRENT_DIR, "./uploads"),
  limits: {
    fileSize: 10000000,
  },
});

app.post("/upload-imgs", cors(), upload.single("images"), (req, res) => {
  console.log(req.file);
  res.status(200).json({ message: "Archivos subidos exitosamente" });
});

app.use("/usuarios", userRoutes);
app.use("/categorias", categoriaRoutes);
app.use("/productos", productRoutes);
app.use("/favoritos", favoritosRoutes);
app.use("/carrito", carritoRoutes);
app.use("/venta", ventaRoutes);
app.use("/preguntas", productRoutes);

app.get("*", (_, res) => {
  res.status(404).send("Ruta no encontrada");
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
