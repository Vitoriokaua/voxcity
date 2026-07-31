import { Router } from 'express';
import { verificarToken, apenasModerador } from '../middlewares/authMiddleware.js';
import uploadCloudinary from '../../configCloudinary.js';
import * as denunciaController from '../controllers/denunciaController.js';
import upvoteRoutes from './upvotes.js';
import comentarioRoutes from './comentarios.js';   // ← novo

const router = Router();

router.post('/', verificarToken, uploadCloudinary.single('foto'), denunciaController.createDenuncia);

router.get('/', denunciaController.getDenuncias);

router.patch('/:id/nota', verificarToken, apenasModerador, denunciaController.addNotaComunidade);

router.patch('/:id/nota/validar', verificarToken, apenasModerador, denunciaController.validarNotaComunidade);

router.use('/:id/apoiar', upvoteRoutes);
router.use('/:denunciaId/comentarios', comentarioRoutes);   // ← novo

export default router;