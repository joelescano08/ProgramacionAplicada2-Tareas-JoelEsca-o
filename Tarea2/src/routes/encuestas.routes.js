import { Router } from "express";
import * as encuestasCtrl from "../controllers/encuestas.controller.js";
import { validarEncuesta } from "../middlewares/validator.js";

const router = Router();

router.get("/encuestas", encuestasCtrl.getEncuestas);
router.post("/encuestas", validarEncuesta, encuestasCtrl.postEncuesta);
router.post("/encuestas/:id/votar", encuestasCtrl.postVotar);
router.get("/encuestas/:id/resultados", encuestasCtrl.getResultados);
router.delete("/encuestas/:id", encuestasCtrl.deleteEncuesta);

export default router;
