import type { Request, Response } from 'express';
import * as upvoteService from '../services/upvoteService.js';
import { ApoioDuplicadoError } from '../services/upvoteService.js';
export const apoiarDenuncia = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
   const usuarioId = (req as any).usuario?.id;

    const denunciaAtualizada = await upvoteService.apoiar(String(id), usuarioId);
    res.json(denunciaAtualizada);
  } catch (error: any) {
    if (error instanceof ApoioDuplicadoError) {
      return res.status(error.statusCode).json({ erro: error.message });
    }
    
  
    if (error.message === 'Denúncia não encontrada.') {
      return res.status(404).json({ erro: error.message });
    }
    
    console.error("Erro no controller ao apoiar denúncia:", error);
    res.status(500).json({ erro: "Erro interno ao apoiar denúncia." });
  }
};