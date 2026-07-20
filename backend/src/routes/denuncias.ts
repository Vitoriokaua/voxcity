import { Router } from 'express';
import { verificarToken, apenasModerador } from '../middlewares/authMiddleware.js';
import uploadCloudinary from '../../configCloudinary.js'; // Puxa a nossa configuração do Cloudinary
import * as denunciaController from '../controllers/denunciaController.js';
import upvoteRoutes from './upvotes.js';

const router = Router();

// Agora a rota usa o uploadCloudinary para receber a 'foto' e mandar pra nuvem!
router.post('/', verificarToken, uploadCloudinary.single('foto'), denunciaController.createDenuncia);

router.get('/', denunciaController.getDenuncias);

router.patch('/:id/nota', verificarToken, apenasModerador, denunciaController.addNotaComunidade);

router.patch('/:id/nota/validar', verificarToken, apenasModerador, denunciaController.validarNotaComunidade);

router.use('/:id/apoiar', upvoteRoutes);

export default router;