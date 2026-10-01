import React, { useState } from "react";
import { Mail, KeyRound, Lock, ArrowLeft, CircleCheck } from "lucide-react";
import toast from "react-hot-toast";

const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://voxcity-backend.onrender.com"
    : "http://localhost:3001";

export function RecuperarSenha({ aoVoltar }) {
  const [etapa, setEtapa] = useState(1);
  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  const solicitarCodigo = async (e) => {
    e.preventDefault();
    setCarregando(true);

    try {
      const res = await fetch(`${API_URL}/auth/esqueci-senha`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        toast.success("Se o e-mail existir, um código foi enviado!");
        setEtapa(2);
      } else {
        toast.error("Erro ao solicitar o código. Tente novamente.");
      }
    } catch (error) {
      toast.error("Erro de conexão.");
    } finally {
      setCarregando(false);
    }
  };

  const confirmarRedefinicao = async (e) => {
    e.preventDefault();

    if (novaSenha !== confirmarSenha) {
      toast.error("As senhas não coincidem.");
      return;
    }

    if (novaSenha.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setCarregando(true);

    try {
      const res = await fetch(`${API_URL}/auth/redefinir-senha`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          codigo,
          novaSenha,
        }),
      });

      const dados = await res.json();

      if (res.ok) {
        toast.success("Senha redefinida com sucesso! Faça login.");
        aoVoltar();
      } else {
        toast.error(dados.erro || "Erro ao redefinir senha.");
      }
    } catch (error) {
      toast.error("Erro de conexão.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-zinc-900/80 backdrop-blur-md p-8 rounded-3xl border border-zinc-800/80 shadow-2xl relative">
      <button
        onClick={aoVoltar}
        className="absolute top-6 left-6 p-2 bg-zinc-800/50 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-full transition-all"
        title="Voltar para o Login"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      <div className="flex flex-col items-center justify-center text-center mb-8 mt-2">
        <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center mb-4 border border-red-500/20">
          <KeyRound className="w-7 h-7 text-red-500" />
        </div>

        <h1 className="text-2xl font-black text-zinc-100 tracking-tight">
          Recuperar Senha
        </h1>

        <p className="text-sm text-zinc-400 mt-1 font-medium">
          {etapa === 1
            ? "Digite seu e-mail para receber um código"
            : "Digite o código recebido e sua nova senha"}
        </p>
      </div>

      {etapa === 1 ? (
        <form onSubmit={solicitarCodigo} className="flex flex-col gap-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />

            <input
              type="email"
              placeholder="Seu e-mail cadastrado"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 pl-11 pr-4 py-3.5 rounded-xl text-sm text-zinc-100 outline-none transition-all focus:border-red-500 focus:ring-1 focus:ring-red-500/50 placeholder:text-zinc-600"
              required
            />
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-red-600 text-white py-4 rounded-xl text-sm font-bold mt-2 hover:bg-red-700 active:scale-[0.98] transition-all shadow-lg shadow-red-600/20 disabled:opacity-50"
          >
            {carregando ? "Enviando..." : "ENVIAR CÓDIGO"}
          </button>
        </form>
      ) : (
        <form
          onSubmit={confirmarRedefinicao}
          className="flex flex-col gap-4"
        >
          <div className="relative">
            <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />

            <input
              type="text"
              placeholder="Código de 6 dígitos"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              maxLength={6}
              className="w-full bg-zinc-950 border border-zinc-800 pl-11 pr-4 py-3.5 rounded-xl text-sm text-zinc-100 outline-none transition-all focus:border-red-500 focus:ring-1 focus:ring-red-500/50 placeholder:text-zinc-600 tracking-widest"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />

            <input
              type="password"
              placeholder="Nova senha"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 pl-11 pr-4 py-3.5 rounded-xl text-sm text-zinc-100 outline-none transition-all focus:border-red-500 focus:ring-1 focus:ring-red-500/50 placeholder:text-zinc-600"
              required
            />
          </div>

          <div className="relative">
            <CircleCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />

            <input
              type="password"
              placeholder="Confirme a nova senha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 pl-11 pr-4 py-3.5 rounded-xl text-sm text-zinc-100 outline-none transition-all focus:border-red-500 focus:ring-1 focus:ring-red-500/50 placeholder:text-zinc-600"
              required
            />
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-red-600 text-white py-4 rounded-xl text-sm font-bold mt-2 hover:bg-red-700 active:scale-[0.98] transition-all shadow-lg shadow-red-600/20 disabled:opacity-50"
          >
            {carregando ? "Redefinindo..." : "REDEFINIR SENHA"}
          </button>

          <button
            type="button"
            onClick={() => setEtapa(1)}
            className="text-zinc-500 text-xs text-center hover:text-zinc-300 transition-colors"
          >
            Não recebeu o código? Tentar novamente
          </button>
        </form>
      )}
    </div>
  );
}