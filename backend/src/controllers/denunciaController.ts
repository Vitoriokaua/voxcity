import type { Request, Response } from 'express';
import * as denunciaService from '../services/denunciaService.js';

/**
 * @description Cria uma nova denúncia
 * @route POST /api/denuncias
 */
export const createDenuncia = async (req: Request, res: Response) => {
  const { descricao, latitude, longitude, endereco, anonimo } = req.body;
  const fotoUrl = req.file ? `/uploads/${req.file.filename}` : null;
  const isAnonimo = anonimo === 'true';

  try {
    const denunciaData = {
      descricao,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      endereco,
      fotoUrl,
      anonimo: isAnonimo,
      // @ts-ignore - A propriedade `usuario` é adicionada pelo middleware
      usuarioId: req.usuario?.id,
    };

    const novaDenuncia = await denunciaService.create(denunciaData);
    res.status(201).json(novaDenuncia);
  } catch (error) {
    console.error("Erro no controller ao criar denúncia:", error);
    res.status(500).json({ erro: "Erro interno ao criar denúncia." });
  }
};

/**
 * @description Busca todas as denúncias
 * @route GET /api/denuncias
 */

export const getDenuncias = async (req: Request, res: Response) => {
  try {
    const denuncias = await denunciaService.findAll();
    res.json(denuncias);
  } catch (error) {
    console.error("Erro no controller ao buscar denúncias:", error);
    res.status(500).json({ erro: "Erro interno ao buscar denúncias." });
  }
};

/**
 * @description Adiciona uma nota da comunidade a uma denúncia
 * @route PATCH /api/denuncias/:id/nota
 */

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
    console.error("Erro no controller ao adicionar nota:", error);
    if (error.statusCode === 404) {
      return res.status(404).json({ erro: error.message });
    }
    res.status(500).json({ erro: "Erro interno ao adicionar nota da comunidade." });
  }
};

/**
 * @description Valida uma nota da comunidade
 * @route POST /api/denuncias/:id/nota/validar
 */
export const validarNotaComunidade = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const denunciaAtualizada = await denunciaService.validateCommunityNote(String(id));

    res.json(denunciaAtualizada);
  } catch (error: any) {
    console.error("Erro no controller ao validar nota:", error);
    if (error.statusCode === 404) {
      return res.status(404).json({ erro: error.message });
    }
    res.status(500).json({ erro: "Erro interno ao validar nota da comunidade." });
  }
};

/**
 * @description Apoia uma denúncia, incrementando o contador de apoios.
 * @route POST /api/denuncias/:id/apoiar
 */
export const apoiarDenuncia = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const denunciaAtualizada = await denunciaService.apoiarDenuncia(String(id));
    res.json(denunciaAtualizada);
  } catch (error: any) {
    console.error("Erro no controller ao apoiar denúncia:", error);
    // O Prisma pode lançar um erro se o registro não for encontrado
    if (error.code === 'P2025') {
      return res.status(404).json({ erro: "Denúncia não encontrada." });
    }
    res.status(500).json({ erro: "Erro interno ao apoiar denúncia." });
  }
};