import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export class ApoioDuplicadoError extends Error {
  statusCode = 409;
  constructor() {
    super('Você já apoiou esta denúncia.');
  }
}

/**
 * Registra o apoio de um usuário a uma denúncia e incrementa o contador,
 * garantindo no máximo um apoio por usuário/denúncia.
 */
export const apoiar = async (denunciaId: string, usuarioId: string) => {
  try {
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

    return denunciaAtualizada;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new ApoioDuplicadoError();
    }
    throw error;
  }
};
