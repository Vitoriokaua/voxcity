import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST /denuncias/:denunciaId/comentarios
export async function criarComentario(req: Request, res: Response) {
  try {
    const { denunciaId } = req.params;
    const { texto, autorId } = req.body;

    if(typeof denunciaId != "string"){
      return res.status(400).json({ error: "denunciaId inválido." });
    }
    if (!texto || !autorId) {
      return res.status(400).json({ error: "Campos 'texto' e 'autorId' são obrigatórios." });
    }

    const denuncia = await prisma.denuncia.findUnique({
      where: { id: denunciaId },
    });

    if (!denuncia) {
      return res.status(404).json({ error: "Denúncia não encontrada." });
    }

    const comentario = await prisma.comentario.create({
      data: {
        texto,
        autorId,
        denunciaId,
      },
    });

    return res.status(201).json(comentario);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao criar comentário." });
  }
}

// GET /denuncias/:denunciaId/comentarios
export async function listarComentarios(req: Request, res: Response) {
  try {
    const { denunciaId } = req.params;
     if(typeof denunciaId != "string"){
           return res.status(400).json({ error: "denunciaId inválido." });
     }
    const denuncia = await prisma.denuncia.findUnique({
      where: { id: denunciaId },
    });

    if (!denuncia) {
      return res.status(404).json({ error: "Denúncia não encontrada." });
    }

    const comentarios = await prisma.comentario.findMany({
      where: { denunciaId },
      orderBy: { createdAt: "asc" },
      include: {
        autor: {
          select: { id: true, nome: true },
        },
      },
    });

    return res.status(200).json(comentarios);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao listar comentários." });
  }
}