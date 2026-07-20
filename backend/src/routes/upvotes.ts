import { Router } from 'express';
import { verificarToken } from '../middlewares/authMiddleware.js';
import * as upvoteController from '../controllers/upvoteController.js';

// mergeParams permite acessar o :id do router pai (denuncias.ts)
const router = Router({ mergeParams: true });

router.post('/', verificarToken, upvoteController.apoiarDenuncia);

export default router;
