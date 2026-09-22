import { Router } from "express";
import * as inventarioCtrl from "../controllers/inventario.controller.js";

const router = Router();

router.get("/inventario", inventarioCtrl.getInventario);
router.post("/inventario", inventarioCtrl.postInventario);
router.post("/inventario/:id/entrada", inventarioCtrl.postEntrada);
router.post("/inventario/:id/salida", inventarioCtrl.postSalida);
router.get("/inventario/alertas", inventarioCtrl.getAlertas); // Esto tiene que ir ANTES o usar path diferente, porque :id puede tomar "alertas".
// Wait, express routes order matters. Let's make sure /inventario/alertas goes BEFORE /inventario/:id
// but in this case /inventario/:id/entrada is different from /inventario/alertas. So they won't clash.

export default router;
