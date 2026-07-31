import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * @description Cria um novo comentário em uma denúncia específica
 * @route POST /denuncias/:denunciaId/comentarios
 */
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

    // usuarioId vem do usuário autenticado (verificarToken), nunca do body
    // @ts-ignore - A propriedade `usuario` é adicionada pelo middleware
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
      data: {
        texto,
        usuarioId,
        denunciaId,
      },
    });

    return res.status(201).json(comentario);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: "Erro ao criar comentário." });
  }
}

/**
 * @description Lista os comentários de uma denúncia específica
 * @route GET /denuncias/:denunciaId/comentarios
 */
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
        usuario: {
          select: { id: true, nome: true },
        },
      },
    });

    return res.status(200).json(comentarios);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: "Erro ao listar comentários." });
  }
}

/**
 * @description Edita o texto de um comentário (apenas o próprio autor pode editar)
 * @route PATCH /denuncias/:denunciaId/comentarios/:comentarioId
 */
export async function editarComentario(req: Request, res: Response) {
  try {
    const { comentarioId } = req.params;
    const { texto } = req.body;

    if (typeof comentarioId != "string") {
      return res.status(400).json({ erro: "comentarioId inválido." });
    }

    if (!texto) {
      return res.status(400).json({ erro: "O campo 'texto' é obrigatório." });
    }

    // @ts-ignore - A propriedade `usuario` é adicionada pelo middleware
    const usuarioId = req.usuario?.id;

    if (!usuarioId) {
      return res.status(401).json({ erro: "Usuário não autenticado." });
    }

    const comentario = await prisma.comentario.findUnique({
      where: { id: comentarioId },
    });

    if (!comentario) {
      return res.status(404).json({ erro: "Comentário não encontrado." });
    }

    // Só o autor do comentário pode editá-lo
    if (comentario.usuarioId !== usuarioId) {
      return res.status(403).json({ erro: "Você não tem permissão para editar este comentário." });
    }

    const comentarioAtualizado = await prisma.comentario.update({
      where: { id: comentarioId },
      data: { texto },
    });

    return res.status(200).json(comentarioAtualizado);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: "Erro ao editar comentário." });
  }
}

/**
 * @description Exclui um comentário (apenas o próprio autor pode excluir)
 * @route DELETE /denuncias/:denunciaId/comentarios/:comentarioId
 */
export async function excluirComentario(req: Request, res: Response) {
  try {
    const { comentarioId } = req.params;

    if (typeof comentarioId != "string") {
      return res.status(400).json({ erro: "comentarioId inválido." });
    }

    // @ts-ignore - A propriedade `usuario` é adicionada pelo middleware
    const usuarioId = req.usuario?.id;

    if (!usuarioId) {
      return res.status(401).json({ erro: "Usuário não autenticado." });
    }

    const comentario = await prisma.comentario.findUnique({
      where: { id: comentarioId },
    });

    if (!comentario) {
      return res.status(404).json({ erro: "Comentário não encontrado." });
    }

    // Só o autor do comentário pode excluí-lo
    if (comentario.usuarioId !== usuarioId) {
      return res.status(403).json({ erro: "Você não tem permissão para excluir este comentário." });
    }

    await prisma.comentario.delete({
      where: { id: comentarioId },
    });

    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: "Erro ao excluir comentário." });
  }
}