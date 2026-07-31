import { Router } from 'express';
import { verificarToken } from '../middlewares/authMiddleware.js';
import * as comentarioController from '../controllers/comentarioController.js';

const router = Router({ mergeParams: true }); // mergeParams para acessar :denunciaId do router pai

router.post('/', verificarToken, comentarioController.criarComentario);

router.get('/', comentarioController.listarComentarios);

router.patch('/:comentarioId', verificarToken, comentarioController.editarComentario);

router.delete('/:comentarioId', verificarToken, comentarioController.excluirComentario);

export default router;