import type { Request, Response } from 'express';
import * as denunciaService from '../services/denunciaService.js';

export const createDenuncia = async (req: Request, res: Response) => {
  const { descricao, latitude, longitude, endereco, anonimo } = req.body;
  const fotoUrl = req.file ? req.file.path : null;
  const isAnonimo = anonimo === 'true';

  try {
    const denunciaData = {
      descricao,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      endereco,
      fotoUrl,
      anonimo: isAnonimo,
      usuarioId: (req as any).usuario?.id,
    };

    const novaDenuncia = await denunciaService.create(denunciaData);
    res.status(201).json(novaDenuncia);
  } catch (error) {
    res.status(500).json({ erro: "Erro interno ao criar denúncia." });
  }
};

export const getDenuncias = async (req: Request, res: Response) => {
  try {
    const denuncias = await denunciaService.findAll();
    res.json(denuncias);
  } catch (error) {
    res.status(500).json({ erro: "Erro interno ao buscar denúncias." });
  }
};

export const getMinhasDenuncias = async (req: Request, res: Response) => {
  try {
    const usuarioId = (req as any).usuario?.id;
    if (!usuarioId) {
      return res.status(401).json({ erro: "Usuário não autenticado." });
    }
    const denuncias = await denunciaService.findMyDenuncias(usuarioId);
    res.json(denuncias);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar suas denúncias." });
  }
};

export const updateDenuncia = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { descricao } = req.body;
    const usuarioId = (req as any).usuario?.id;

    if (!descricao || descricao.trim() === "") {
      return res.status(400).json({ erro: "A descrição é obrigatória." });
    }

    const denunciaAtualizada = await denunciaService.updateDenuncia(String(id), usuarioId, descricao);
    res.json(denunciaAtualizada);
  } catch (error: any) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ erro: error.message });
    }
    res.status(500).json({ erro: "Erro ao atualizar denúncia." });
  }
};

export const deleteDenuncia = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const usuarioId = (req as any).usuario?.id;

    await denunciaService.deleteDenuncia(String(id), usuarioId);
    res.json({ mensagem: "Denúncia removida com sucesso." });
  } catch (error: any) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ erro: error.message });
    }
    res.status(500).json({ erro: "Erro ao excluir denúncia." });
  }
};

export const addNotaComunidade = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { notaComunidade } = req.body;

    if (!notaComunidade) {
      return res.status(400).json({ erro: "O campo notaComunidade é obrigatório." });
    }

    const denunciaAtualizada = await denunciaService.addCommunityNote(String(id), notaComunidade);
    res.json(denunciaAtualizada);
  } catch (error: any) {
    if (error.statusCode === 404) {
      return res.status(404).json({ erro: error.message });
    }
    res.status(500).json({ erro: "Erro interno ao adicionar nota da comunidade." });
  }
};

export const validarNotaComunidade = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const denunciaAtualizada = await denunciaService.validateCommunityNote(String(id));
    res.json(denunciaAtualizada);
  } catch (error: any) {
    if (error.statusCode === 404) {
      return res.status(404).json({ erro: error.message });
    }
    res.status(500).json({ erro: "Erro interno ao validar nota da comunidade." });
  }
};

// usado na aba "Mais Relevantes" 
export const getDenunciasRelevantes = async (req: Request, res: Response) => {
  try {
    const { periodo } = req.query;
    const periodosValidos = ['dia', 'semana', 'mes', 'ano', 'todos'];
    const periodoSelecionado = periodosValidos.includes(String(periodo)) ? String(periodo) : 'todos';

    const denuncias = await denunciaService.findRelevantes(periodoSelecionado);
    res.json(denuncias);
  } catch (error) {
    res.status(500).json({ erro: "Erro interno ao buscar denúncias relevantes." });
  }
};