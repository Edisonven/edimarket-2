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
const port = process.env.PORT || 3000;
import multer from "multer";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url));

const upload = multer({
  dest: join(CURRENT_DIR, "./uploads"),
  limits: {
    fileSize: 10000000,
  },
});

app.post("/upload-imgs", upload.single("images"), (req, res) => {
  console.log(req.file);

  res.status(200).json({ message: "archivos subidos exitosamente" });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

app.use(cors());
app.use(json());

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
