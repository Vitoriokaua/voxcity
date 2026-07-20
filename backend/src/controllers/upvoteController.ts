import type { Request, Response } from 'express';
import * as upvoteService from '../services/upvoteService.js';
import { ApoioDuplicadoError } from '../services/upvoteService.js';

/**
 * @description Apoia uma denúncia. Cada usuário pode apoiar uma mesma denúncia apenas uma vez.
 * @route POST /denuncias/:id/apoiar
 */
export const apoiarDenuncia = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // @ts-ignore - A propriedade `usuario` é adicionada pelo middleware verificarToken
    const usuarioId = req.usuario?.id;

    const denunciaAtualizada = await upvoteService.apoiar(String(id), usuarioId);
    res.json(denunciaAtualizada);
  } catch (error: any) {
    if (error instanceof ApoioDuplicadoError) {
      return res.status(error.statusCode).json({ erro: error.message });
    }
    console.error("Erro no controller ao apoiar denúncia:", error);
    // P2025: registro não encontrado no update / P2003: FK inválida no create (denúncia inexistente)
    if (error.code === 'P2025' || error.code === 'P2003') {
      return res.status(404).json({ erro: "Denúncia não encontrada." });
    }
    res.status(500).json({ erro: "Erro interno ao apoiar denúncia." });
  }
};
