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