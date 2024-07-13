import { Router } from "express";
const router = Router();
import { productController } from "../controllers/productController.js";
import verificarToken from "../middlewares/verificarToken.js";

router.get("/", productController.getProductos);
router.get("/:id", productController.getProductoById);
router.post("/", verificarToken, productController.agregarProducto);
router.put("/:idProducto", verificarToken, productController.modifyProducto);
router.get("/productos/all", productController.getAllProducts);
router.get("/preguntas/:idProduct", productController.getPreguntasByProductId);
router.get("/producto/:IdUser",verificarToken, productController.getProductOnQuestions);
router.post("/valoracion/:idProducto",verificarToken, productController.sendProductValoration);

export default router;
