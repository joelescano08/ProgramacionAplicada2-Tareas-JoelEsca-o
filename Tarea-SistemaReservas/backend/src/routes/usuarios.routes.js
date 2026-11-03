import { Router } from 'express';
import { actualizarPerfil, obtenerPerfil } from '../controllers/usuarios.controller.js';
import { autenticar } from '../middlewares/auth.middleware.js';

const router = Router();
router.use(autenticar); 
router.get('/perfil', obtenerPerfil); 
router.put('/perfil', actualizarPerfil);

export default router;