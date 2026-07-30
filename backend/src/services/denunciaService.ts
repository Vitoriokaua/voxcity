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

export const create = async (data: CreateDenunciaData) => {
  return prisma.denuncia.create({ data });
};

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

export const findMyDenuncias = async (usuarioId: string) => {
  return prisma.denuncia.findMany({
    where: { usuarioId },
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

export const updateDenuncia = async (id: string, usuarioId: string, descricao: string) => {
  const denuncia = await prisma.denuncia.findUnique({ where: { id } });

  if (!denuncia) {
    const error = new Error("Denúncia não encontrada.");
    (error as any).statusCode = 404;
    throw error;
  }

  if (denuncia.usuarioId !== usuarioId) {
    const error = new Error("Não autorizado a editar esta denúncia.");
    (error as any).statusCode = 403;
    throw error;
  }

  return prisma.denuncia.update({
    where: { id },
    data: { descricao },
    include: {
      usuario: {
        select: {
          nome: true,
        },
      },
    },
  });
};

export const deleteDenuncia = async (id: string, usuarioId: string) => {
  const denuncia = await prisma.denuncia.findUnique({ where: { id } });

  if (!denuncia) {
    const error = new Error("Denúncia não encontrada.");
    (error as any).statusCode = 404;
    throw error;
  }

  if (denuncia.usuarioId !== usuarioId) {
    const error = new Error("Não autorizado a excluir esta denúncia.");
    (error as any).statusCode = 403;
    throw error;
  }

  await prisma.comentario.deleteMany({ where: { denunciaId: id } });
  await prisma.apoio.deleteMany({ where: { denunciaId: id } });

  return prisma.denuncia.delete({
    where: { id },
  });
};

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

export const validateCommunityNote = async (id: string) => {
  const denuncia = await prisma.denuncia.findUnique({
    where: { id },
  });

  if (!denuncia) {
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