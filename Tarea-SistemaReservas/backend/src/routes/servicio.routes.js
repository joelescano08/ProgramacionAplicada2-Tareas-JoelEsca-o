import { Router } from 'express';
import { obtenerServicios, crearServicio, actualizarServicio, eliminarServicio } from '../controllers/servicio.controller.js';
import { autenticar, esAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(autenticar);

router.get('/', obtenerServicios);

router.post('/', esAdmin, crearServicio);
router.put('/:id', esAdmin, actualizarServicio);
router.delete('/:id', esAdmin, eliminarServicio);

export default router;