import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CreateDenunciaData {
  descricao: string;
  latitude: number;
  longitude: number;
  endereco: string;
  fotoUrl: string | null;
  anonimo: boolean;
  usuarioId?: string;
}

/**
 * Cria uma nova denúncia no banco de dados.
 */

export const create = async (data: CreateDenunciaData) => {
  return prisma.denuncia.create({ data });
};

/**
 * Busca todas as denúncias, incluindo o nome do autor.
 */

export const findAll = async () => {
  return prisma.denuncia.findMany({
    orderBy: { criadoEm: 'desc' },
    include: {
      usuario: {
        select: {
          nome: true,
        },
      },
    },
  });
};

/**
 * Adiciona ou atualiza a nota da comunidade para uma denúncia.
 */

export const addCommunityNote = async (id: string, notaComunidade: string) => {
  return prisma.denuncia.update({
    where: { id },
    data: {
      notaComunidade,
      notaStatus: 'PENDENTE',
      votosMod: 1,
    },
  });
};

/**
 * Valida a nota de uma comunidade, incrementando os votos e atualizando o status.
 */

export const validateCommunityNote = async (id: string) => {
  const denuncia = await prisma.denuncia.findUnique({
    where: { id },
  });

  if (!denuncia) {
    //erro que o controller irá capturar e tratar.
    const error = new Error("Denúncia não encontrada");
    (error as any).statusCode = 404;
    throw error;
  }

  const novosVotos = (denuncia.votosMod || 0) + 1;
  const novoStatus = novosVotos >= 2 ? 'APROVADA' : 'PENDENTE';

  return prisma.denuncia.update({
    where: { id },
    data: {
      votosMod: novosVotos,
      notaStatus: novoStatus,
    },
  });
};