import { Router } from "express";
import * as productosCtrl from "../controllers/productos.controller.js";
import { validarProducto, validarDescuento } from "../middlewares/validator.js";

const router = Router();

router.get("/productos", productosCtrl.getProductos);
router.post("/productos", validarProducto, productosCtrl.postProducto);
router.put("/productos/:id", validarProducto, productosCtrl.putProducto);
router.delete("/productos/:id", productosCtrl.deleteProducto);

router.get("/carrito/total", productosCtrl.getTotal);
router.post("/carrito/aplicar-descuento", validarDescuento, productosCtrl.aplicarDescuento);

export default router;
