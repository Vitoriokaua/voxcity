import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import type { Request, Response } from 'express';
import { verificarToken, apenasModerador } from '../middlewares/authMiddleware.js';
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

router.post('/', verificarToken, upload.single('foto'), async (req: any, res: any) => {
  const { descricao, latitude, longitude, endereco, anonimo } = req.body;
  const fotoUrl = req.file ? `/uploads/${req.file.filename}` : null;
  const isAnonimo = anonimo === 'true';

  try {
    const novaDenuncia = await prisma.denuncia.create({
      data: {
        descricao,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        endereco, 
        fotoUrl,
        anonimo: isAnonimo, 
        usuarioId: req.usuario?.id 
      },
    });
    res.status(201).json(novaDenuncia);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao salvar denúncia" });
  }
});

router.get('/', async (req, res) => {
  try {
    const denuncias = await prisma.denuncia.findMany({
      orderBy: { id: 'desc' },
      include: {
        usuario: {
          select: {
            nome: true 
          }
        }
      }
    });
    res.json(denuncias);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar denúncias" });
  }
});

router.patch('/:id/nota', verificarToken, apenasModerador, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { notaComunidade } = req.body;

    const denunciaAtualizada = await prisma.denuncia.update({
      where: { id: id as string },
      data: { 
        notaComunidade,
        notaStatus: "PENDENTE",
        votosMod: 1
      }
    });

    res.json(denunciaAtualizada);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao adicionar nota da comunidade" });
  }
});

router.post('/:id/nota/validar', verificarToken, apenasModerador, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const denuncia = await prisma.denuncia.findUnique({
      where: { id: id as string }
    });

    if (!denuncia) {
      return res.status(404).json({ erro: "Denúncia não encontrada" });
    }

    const novosVotos = (denuncia.votosMod || 0) + 1;
    const novoStatus = novosVotos >= 2 ? "APROVADA" : "PENDENTE";

    const denunciaAtualizada = await prisma.denuncia.update({
      where: { id: id as string },
      data: {
        votosMod: novosVotos,
        notaStatus: novoStatus
      }
    });

    res.json(denunciaAtualizada);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao validar nota da comunidade" });
  }
});

export default router;