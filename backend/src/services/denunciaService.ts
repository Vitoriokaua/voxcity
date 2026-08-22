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
      apoiosDe: {
        select: {
          usuarioId: true,
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

//aba Mais Relevantes
// Regra: filtra denúncias CRIADAS dentro do período selecionado,
// ordenadas pelo total de apoios (do maior pro menor).

const calcularDataLimite = (periodo: string): Date | null => {
  const agora = new Date();

  switch (periodo) {
    case 'dia': {
      const inicioDia = new Date(agora);
      inicioDia.setHours(0, 0, 0, 0);
      return inicioDia;
    }
    case 'semana': {
      const seteDiasAtras = new Date(agora);
      seteDiasAtras.setDate(agora.getDate() - 7);
      return seteDiasAtras;
    }
    case 'mes': {
      const trintaDiasAtras = new Date(agora);
      trintaDiasAtras.setDate(agora.getDate() - 30);
      return trintaDiasAtras;
    }
    case 'ano': {
      const umAnoAtras = new Date(agora);
      umAnoAtras.setFullYear(agora.getFullYear() - 1);
      return umAnoAtras;
    }
    default:
      return null; // 'todos'
  }
};

export const findRelevantes = async (periodo: string) => {
  const dataLimite = calcularDataLimite(periodo);

  const denuncias = await prisma.denuncia.findMany({
    where: dataLimite
      ? { criadoEm: { gte: dataLimite } }
      : {},
    orderBy: { apoios: 'desc' },
    include: {
      usuario: {
        select: { nome: true },
      },
      apoiosDe: {
        select: { usuarioId: true },
      },
    },
  });

  return denuncias;
};

 