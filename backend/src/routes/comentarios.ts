import { Router } from 'express';
import { verificarToken } from '../middlewares/authMiddleware.js';
import * as comentarioController from '../controllers/comentarioController.js';

const router = Router({ mergeParams: true });

router.post('/', verificarToken, comentarioController.criarComentario);
router.get('/', comentarioController.listarComentarios);
router.delete('/:id', verificarToken, comentarioController.excluirComentario);

export default router;