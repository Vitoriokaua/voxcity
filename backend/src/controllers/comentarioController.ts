import type { Request, Response } from 'express';
import * as comentarioService from '../services/comentarioService.js';

export const criarComentario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { texto } = req.body;
    const usuarioId = (req as any).usuario?.id;

    if (!texto) {
      return res.status(400).json({ erro: "O texto é obrigatório." });
    }

    const novoComentario = await comentarioService.criar(texto, usuarioId, String(id));
    res.status(201).json(novoComentario);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao criar comentário." });
  }
};

export const listarComentarios = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const comentarios = await comentarioService.buscarPorDenuncia(String(id));
    res.json(comentarios);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar comentários." });
  }
};


export const excluirComentario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; 
  
    await comentarioService.excluir(String(id));
    
    res.status(200).json({ mensagem: "Comentário excluído com sucesso." });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao excluir o comentário." });
  }
};