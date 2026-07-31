import type { Request, Response } from 'express';
import * as upvoteService from '../services/upvoteService.js';

/**
 * @description Adiciona ou remove o apoio a uma denúncia (Toggle).
 * @route POST /denuncias/:id/apoiar
 */
export const apoiarDenuncia = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // @ts-ignore
    const usuarioId = req.usuario?.id;

    if (!usuarioId) {
      return res.status(401).json({ erro: "Usuário não autenticado." });
    }

    const resultado = await upvoteService.toggleApoio(String(id), usuarioId);
    res.json(resultado);
  } catch (error: any) {
    console.error("Erro no controller ao processar apoio:", error);
    // P2025: registro não encontrado / P2003: FK inválida (denúncia inexistente)
    if (error.code === 'P2025' || error.code === 'P2003') {
      return res.status(404).json({ erro: "Denúncia não encontrada." });
    }
    res.status(500).json({ erro: "Erro interno ao processar o apoio." });
  }
};