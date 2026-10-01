import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { enviarCodigoRecuperacao } from './emailService.js';

const prisma = new PrismaClient();

const gerarCodigo = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 dígitos
};

export const solicitarRecuperacao = async (emailBruto: string) => {
  const email = String(emailBruto).trim().toLowerCase();
  const usuario = await prisma.usuario.findUnique({ where: { email } });

  // Por segurança, não revela se o e-mail existe ou não
  if (!usuario) {
    return;
  }

  const codigo = gerarCodigo();
  const expiraEm = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

  await prisma.usuario.update({
    where: { id: usuario.id },
    data: {
      codigoResetSenha: codigo,
      codigoResetExpiraEm: expiraEm,
    },
  });

  await enviarCodigoRecuperacao(usuario.email, usuario.nome, codigo);
};

export const redefinirSenha = async (emailBruto: string, codigo: string, novaSenha: string) => {
  const email = String(emailBruto).trim().toLowerCase();
  const usuario = await prisma.usuario.findUnique({ where: { email } });

  if (!usuario || !usuario.codigoResetSenha || !usuario.codigoResetExpiraEm) {
    const error = new Error("Código inválido ou expirado.");
    (error as any).statusCode = 400;
    throw error;
  }

  if (usuario.codigoResetSenha !== codigo) {
    const error = new Error("Código inválido.");
    (error as any).statusCode = 400;
    throw error;
  }

  if (new Date() > usuario.codigoResetExpiraEm) {
    const error = new Error("Código expirado. Solicite um novo.");
    (error as any).statusCode = 400;
    throw error;
  }

  const salt = await bcrypt.genSalt(10);
  const senhaHash = await bcrypt.hash(novaSenha, salt);

  await prisma.usuario.update({
    where: { id: usuario.id },
    data: {
      senha: senhaHash,
      codigoResetSenha: null,
      codigoResetExpiraEm: null,
    },
  });
};