import { Router } from "express";
const router = Router();

import { userController } from "../controllers/userController.js";

import verificarToken from "../middlewares/verificarToken.js";

router.get("/", userController.getAllUsers);
router.get("/verify-data", userController.verifyTokenByUser);
router.get("/usuario-token", verificarToken,userController.getUserByTokenRegistered);
router.get("/:id", userController.getUserById);
router.get("/usuario/productos",verificarToken,userController.consultarProductosPerUser);
router.post("/registro", userController.registrarUser);
router.post("/login", userController.loginUser);
router.post("/domicilio", verificarToken, userController.agregarDomicilio);
router.get("/usuario/domicilio",verificarToken,userController.consultarDomicilio);
router.put("/domicilio", verificarToken, userController.modificarDomicilio);
router.post("/metodosPago",verificarToken,userController.agregarPaymentMethod);
router.get("/usuario/metodosPago",verificarToken,userController.consultarPaymentMethods);
router.delete("/", verificarToken, userController.deleteUser);
router.patch("/", verificarToken, userController.ModifyUser);
router.delete("/:idProducto",verificarToken,userController.deleteProductoDelUsuario);
router.delete("/usuario/metodosPago/:idMetodoDePago",verificarToken,userController.deletePaymentMethod);
router.delete("/usuario/domicilio/:idDomicilio",verificarToken,userController.deleteDomicilio);
router.get("/usuario/ventas", verificarToken, userController.consultarVentas);
router.get("/usuario/valorar/completed", verificarToken, userController.getCompletedValorated);
router.get("/usuario/valorar/pending", verificarToken, userController.getPendingValorated);
router.post("/preguntas", verificarToken, userController.preguntaRealizada);
router.get("/preguntas/:id", verificarToken, userController.getPreguntas);
router.put("/preguntas", verificarToken, userController.modifyPreguntas);
router.delete("/preguntas/:productId", verificarToken, userController.deletePreguntas);

export default router;
