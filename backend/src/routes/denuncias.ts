import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';

const router = Router();
const prisma = new PrismaClient();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const nomeUnico = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, nomeUnico + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

router.post('/', upload.single('foto'), async (req, res) => {
  const { descricao, latitude, longitude, endereco } = req.body;
  const fotoUrl = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const novaDenuncia = await prisma.denuncia.create({
      data: {
        descricao,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        endereco, 
        fotoUrl,
      },
    });
    res.status(201).json(novaDenuncia);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao salvar denúncia" });
  }
});

router.get('/', async (req, res) => {
  const denuncias = await prisma.denuncia.findMany({
    orderBy: { id: 'desc' }
  });
  res.json(denuncias);
});

export default router;