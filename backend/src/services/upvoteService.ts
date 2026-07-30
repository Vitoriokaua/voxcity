import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const toggleApoio = async (denunciaId: string, usuarioId: string) => {
  // 1. Verifica se o usuário já apoiou essa denúncia
  const apoioExistente = await prisma.apoio.findUnique({
    where: {
      usuarioId_denunciaId: {
        usuarioId,
        denunciaId,
      },
    },
  });

  if (apoioExistente) {

    const [, denunciaAtualizada] = await prisma.$transaction([
      prisma.apoio.delete({
        where: { id: apoioExistente.id },
      }),
      prisma.denuncia.update({
        where: { id: denunciaId },
        data: { apoios: { decrement: 1 } },
        include: {
          usuario: {
            select: { nome: true },
          },
        },
      }),
    ]);

    return { denunciaAtualizada, curtiu: false };
  } else {
    // 3. Se NÃO EXISTE, criamos o apoio e somamos 1 no contador
    const [, denunciaAtualizada] = await prisma.$transaction([
      prisma.apoio.create({
        data: { denunciaId, usuarioId },
      }),
      prisma.denuncia.update({
        where: { id: denunciaId },
        data: { apoios: { increment: 1 } },
        include: {
          usuario: {
            select: { nome: true },
          },
        },
      }),
    ]);

    return { denunciaAtualizada, curtiu: true };
  }
};