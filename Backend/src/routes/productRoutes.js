import { Router } from "express";
import { productController } from "../controllers/productController.js";
import verificarToken from "../middlewares/verificarToken.js";
const router = Router();

router.get("/", productController.getProductos);
router.get("/:id", productController.getProductoById);
router.post("/", verificarToken, productController.agregarProducto);
router.put("/:idProducto", verificarToken, productController.modifyProducto);
router.get("/productos/all", productController.getAllProducts);
router.get("/preguntas/:idProduct", productController.getPreguntasByProductId);
router.get("/producto/:IdUser",verificarToken, productController.getProductOnQuestions);
router.post("/valoracion",verificarToken, productController.sendProductValoration);
router.get("/valoracion/:productId", productController.getProductValoration);
router.patch("/updatestock", verificarToken,productController.updateStockInProduct);

export default router;
