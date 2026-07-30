import { Router } from 'express';
import { verificarToken, apenasModerador } from '../middlewares/authMiddleware.js';
import uploadCloudinary from '../../configCloudinary.js';
import * as denunciaController from '../controllers/denunciaController.js';
import upvoteRoutes from './upvotes.js';
import comentarioRoutes from './comentarios.js';

const router = Router();

router.post('/', verificarToken, uploadCloudinary.single('foto'), denunciaController.createDenuncia);
router.get('/', denunciaController.getDenuncias);
router.get('/minhas', verificarToken, denunciaController.getMinhasDenuncias);
router.patch('/:id', verificarToken, denunciaController.updateDenuncia);
router.delete('/:id', verificarToken, denunciaController.deleteDenuncia);
router.patch('/:id/nota', verificarToken, apenasModerador, denunciaController.addNotaComunidade);
router.patch('/:id/nota/validar', verificarToken, apenasModerador, denunciaController.validarNotaComunidade);
router.use('/:id/apoiar', upvoteRoutes);
router.use('/:id/comentarios', comentarioRoutes);

export default router;