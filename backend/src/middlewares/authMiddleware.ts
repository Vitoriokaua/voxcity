import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken'; // 1. Corrigido para alinhar com o auth.ts

export const verificarToken = (req: any, res: Response, next: NextFunction) => {
  
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ erro: "Acesso negado. Faça login." });
  }

  try {
    const decodificado = jwt.verify(token, process.env.JWT_SECRET || 'segredo_temporario_voxcity');

 
    res.locals.usuario = decodificado;
    req.usuario = decodificado; 
    
    next();
  } catch (error) {
 
    console.error("❌ Erro interno na verificação do Token:", error);
    return res.status(400).json({ erro: "Token inválido." });
  }
};

export const apenasModerador = (req: Request, res: Response, next: NextFunction) => {
  const usuario = res.locals.usuario;
  
  if (!usuario || usuario.role !== 'MODERADOR') {
    return res.status(403).json({ erro: "Acesso negado. Apenas moderadores." });
  }
  
  next();
};