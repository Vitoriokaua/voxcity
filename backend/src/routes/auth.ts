import { Router } from 'express';
import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as authController from '../controllers/authController.js';

const router = Router();
const prisma = new PrismaClient();

router.post('/cadastro', async (req: Request, res: Response) => {
  try {
    const { nome, email, senha } = req.body;
    const emailNormalizado = String(email).trim().toLowerCase();

    const usuarioExiste = await prisma.usuario.findUnique({
      where: { email: emailNormalizado }
    });

    if (usuarioExiste) {
      return res.status(400).json({ erro: "Email já cadastrado" });
    }

    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);

    const novoUsuario = await prisma.usuario.create({
      data: {
        nome,
        email: emailNormalizado,
        senha: senhaHash,
        role: "CIDADAO",
      }
    });

    return res.status(201).json({
      id: novoUsuario.id,
      nome: novoUsuario.nome,
      email: novoUsuario.email,
      role: novoUsuario.role
    });

  } catch (error) {
    console.error("❌ ERRO REAL NO CADASTRO:", error);

    return res.status(500).json({
      erro: "Erro ao cadastrar",
      detalhe: error instanceof Error ? error.message : String(error)
    });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, senha } = req.body;
    const emailNormalizado = String(email).trim().toLowerCase();

    const usuario = await prisma.usuario.findUnique({
      where: { email: emailNormalizado }
    });

    if (!usuario) {
      return res.status(400).json({ erro: "Credenciais inválidas" });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(400).json({ erro: "Credenciais inválidas" });
    }

    const token = jwt.sign(
      { id: usuario.id, role: usuario.role },
      process.env.JWT_SECRET || 'segredo_temporario_voxcity',
      { expiresIn: '7d' }
    );

    return res.json({
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role
      }
    });

  } catch (error) {
    console.error("❌ ERRO REAL NO LOGIN:", error);

    return res.status(500).json({
      erro: "Erro no login",
      detalhe: error instanceof Error ? error.message : String(error)
    });
  }
});

router.post('/esqueci-senha', authController.esqueciSenha);
router.post('/redefinir-senha', authController.redefinirSenha);

export default router;