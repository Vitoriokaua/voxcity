import type { Request, Response } from 'express';
import * as authService from '../services/authService.js';

export const esqueciSenha = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        erro: "O e-mail é obrigatório."
      });
    }

    await authService.solicitarRecuperacao(email);

    return res.json({
      mensagem: "Se o e-mail existir, um código foi enviado."
    });

  } catch (error) {
    console.error("❌ ERRO RECUPERAÇÃO DE SENHA:", error);

    return res.status(500).json({
      erro: "Erro ao solicitar recuperação de senha."
    });
  }
};

export const redefinirSenha = async (req: Request, res: Response) => {
  try {
    const { email, codigo, novaSenha } = req.body;

    if (!email || !codigo || !novaSenha) {
      return res.status(400).json({
        erro: "E-mail, código e nova senha são obrigatórios."
      });
    }

    if (novaSenha.length < 6) {
      return res.status(400).json({
        erro: "A nova senha deve ter pelo menos 6 caracteres."
      });
    }

    await authService.redefinirSenha(email, codigo, novaSenha);

    return res.json({
      mensagem: "Senha redefinida com sucesso."
    });

  } catch (error: any) {
    console.error("❌ ERRO AO REDEFINIR SENHA:", error);

    if (error.statusCode) {
      return res.status(error.statusCode).json({
        erro: error.message
      });
    }

    return res.status(500).json({
      erro: "Erro ao redefinir senha."
    });
  }
};