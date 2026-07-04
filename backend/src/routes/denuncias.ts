import { Router } from 'express';
import { verificarToken, apenasModerador } from '../middlewares/authMiddleware.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import * as denunciaController from '../controllers/denunciaController.js';

const router = Router();

// Define o diretório de uploads
const uploadDir = 'uploads';

// Garante que o diretório de uploads exista. Se não, o cria
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuração do Multer para upload de arquivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const nomeUnico = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, nomeUnico + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

router.post('/', verificarToken, upload.single('foto'), denunciaController.createDenuncia);

router.get('/', denunciaController.getDenuncias);

router.patch('/:id/nota', verificarToken, apenasModerador, denunciaController.addNotaComunidade);

router.post('/:id/nota/validar', verificarToken, apenasModerador, denunciaController.validarNotaComunidade);

export default router;