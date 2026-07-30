import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ApoioDuplicadoError extends Error {
  statusCode = 409;
  constructor() {
    super('Você já apoiou esta denúncia.');
  }
}

export const apoiar = async (denunciaId: string, usuarioId: string) => {
  // 1. Busca a denúncia para ver se o usuário já está no array
  const denuncia = await prisma.denuncia.findUnique({
    where: { id: denunciaId },
  });

  if (!denuncia) {
    throw new Error('Denúncia não encontrada.');
  }

  // 2. Verifica duplicidade (ApoioDuplicado)
  if (denuncia.apoiadoresIds.includes(usuarioId)) {
    throw new ApoioDuplicadoError();
  }

  // 3. Atualiza a denúncia: insere o ID no array E incrementa o contador
  const denunciaAtualizada = await prisma.denuncia.update({
    where: { id: denunciaId },
    data: {
      apoiadoresIds: {
        push: usuarioId, 
      },
      apoios: {
        increment: 1, // 
      }
    },
    include: {
      usuario: {
        select: { nome: true },
      },
    },
  });

  return denunciaAtualizada;
};