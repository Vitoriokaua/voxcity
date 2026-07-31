import { Router } from 'express';
import { verificarToken } from '../middlewares/authMiddleware.js';
import * as comentarioController from '../controllers/comentarioController.js';

const router = Router({ mergeParams: true });

router.post('/', verificarToken, comentarioController.criarComentario);
router.get('/', comentarioController.listarComentarios);

export default router;