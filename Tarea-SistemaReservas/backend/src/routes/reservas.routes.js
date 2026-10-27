import { Router } from 'express';
import {
  crearReserva,
  obtenerMisReservas,
  obtenerTodasLasReservas,
  cambiarEstadoReserva,
  cancelarMiReserva,
} from '../controllers/reservas.controller.js';
import { autenticar, esAdmin } from '../middlewares/auth.middleware.js';

const router = Router();
router.use(autenticar);

router.post('/', crearReserva);
router.get('/mis-reservas', obtenerMisReservas);
router.delete('/:id', cancelarMiReserva);
router.get('/', esAdmin, obtenerTodasLasReservas);
router.put('/:id/estado', esAdmin, cambiarEstadoReserva);

export default router;