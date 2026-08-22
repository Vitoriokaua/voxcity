import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const criar = async (texto: string, usuarioId: string, denunciaId: string) => {
  return prisma.comentario.create({
    data: {
      texto,
      usuarioId,
      denunciaId,
    },
    include: {
      usuario: {
        select: { nome: true },
      },
    },
  });
};

export const buscarPorDenuncia = async (denunciaId: string) => {
  return prisma.comentario.findMany({
    where: { denunciaId },
    orderBy: { criadoEm: 'asc' },
    include: {
      usuario: {
        select: { nome: true },
      },
    },
  });
};

export const excluir = async (id: string, usuarioId: string) => {
  const comentario = await prisma.comentario.findUnique({
    where: { id },
  });

  if (!comentario) {
    const error = new Error("Comentário não encontrado.");
    (error as any).statusCode = 404;
    throw error;
  }

  if (comentario.usuarioId !== usuarioId) {
    const error = new Error("Não autorizado a excluir este comentário.");
    (error as any).statusCode = 403;
    throw error;
  }

  return await prisma.comentario.delete({
    where: { id }
  });
};