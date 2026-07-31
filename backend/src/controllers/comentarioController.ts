import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function criarComentario(req: Request, res: Response) {
  try {
    const { denunciaId } = req.params;
    const { texto } = req.body;

    if (typeof denunciaId != "string") {
      return res.status(400).json({ erro: "denunciaId inválido." });
    }

    if (!texto) {
      return res.status(400).json({ erro: "O campo 'texto' é obrigatório." });
    }

    // @ts-ignore
    const usuarioId = req.usuario?.id;

    if (!usuarioId) {
      return res.status(401).json({ erro: "Usuário não autenticado." });
    }

    const denuncia = await prisma.denuncia.findUnique({
      where: { id: denunciaId },
    });

    if (!denuncia) {
      return res.status(404).json({ erro: "Denúncia não encontrada." });
    }

    const comentario = await prisma.comentario.create({
      data: { texto, usuarioId, denunciaId },
    });

    return res.status(201).json(comentario);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: "Erro ao criar comentário." });
  }
}

export async function listarComentarios(req: Request, res: Response) {
  try {
    const { denunciaId } = req.params;

    if (typeof denunciaId != "string") {
      return res.status(400).json({ erro: "denunciaId inválido." });
    }

    const denuncia = await prisma.denuncia.findUnique({
      where: { id: denunciaId },
    });

    if (!denuncia) {
      return res.status(404).json({ erro: "Denúncia não encontrada." });
    }

    const comentarios = await prisma.comentario.findMany({
      where: { denunciaId },
      orderBy: { criadoEm: "asc" },
      include: {
        usuario: { select: { id: true, nome: true } },
      },
    });

    return res.status(200).json(comentarios);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: "Erro ao listar comentários." });
  }
}