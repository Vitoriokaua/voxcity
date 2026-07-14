import React, { useState } from "react";
import { Mail, Lock, User, MapPin, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

const TelaLogin = ({ aoLogar, aoVoltar }) => {
  // <-- Recebendo o aoVoltar
  const [modo, setModo] = useState("login");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const manipularSubmissao = async (e) => {
    e.preventDefault();
    setErro("");

    const url = modo === "login" ? "/auth/login" : "/auth/cadastro";
    const corpo = modo === "login" ? { email, senha } : { nome, email, senha };

    try {
      const res = await fetch(`http://localhost:3001${url}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(corpo),
      });

      const dados = await res.json();

      if (!res.ok) throw new Error(dados.erro);

      if (modo === "login") {
        localStorage.setItem("token", dados.token);
        localStorage.setItem("usuario", JSON.stringify(dados.usuario));
        aoLogar(dados.usuario);
      } else {
        setModo("login");
        toast.success(
          "Cadastro realizado com sucesso! Agora faça o seu login.",
        );
      }
    } catch (err) {
      setErro(err.message);
    }
  };

  return (
    // Adicionamos 'relative' na div principal para posicionar o botão de voltar
    <div className="w-full max-w-md bg-zinc-900/80 backdrop-blur-md p-8 rounded-3xl border border-zinc-800/80 shadow-2xl relative">
      {/* BOTAO DE VOLTAR */}
      {aoVoltar && (
        <button
          onClick={aoVoltar}
          className="absolute top-6 left-6 p-2 bg-zinc-800/50 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-full transition-all"
          title="Voltar para o Início"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      )}

      {/* BRANDING E TEXTOS */}
      <div className="flex flex-col items-center justify-center text-center mb-8">
        <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center mb-4 border border-red-500/20 mt-2">
          <MapPin className="w-7 h-7 text-red-500" />
        </div>
        <h1 className="text-2xl font-black text-zinc-100 tracking-tight">
          VoxCity
        </h1>
        <p className="text-sm text-zinc-400 mt-1 font-medium">
          Sistema de Denúncias Urbanas
        </p>
      </div>

      {/* ABAS DE NAVEGAÇÃO */}
      <div className="flex bg-zinc-950 p-1 rounded-2xl mb-8 border border-zinc-800/50">
        <button
          type="button"
          onClick={() => {
            setModo("login");
            setErro("");
          }}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold tracking-wider transition-all duration-300 ${
            modo === "login"
              ? "bg-zinc-800 text-zinc-100 shadow-sm"
              : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          ACESSAR CONTA
        </button>
        <button
          type="button"
          onClick={() => {
            setModo("cadastro");
            setErro("");
          }}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold tracking-wider transition-all duration-300 ${
            modo === "cadastro"
              ? "bg-zinc-800 text-zinc-100 shadow-sm"
              : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          CRIAR CONTA
        </button>
      </div>

      {/* FORMULÁRIO */}
      <form onSubmit={manipularSubmissao} className="flex flex-col gap-4">
        {modo === "cadastro" && (
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Nome completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 pl-11 pr-4 py-3.5 rounded-xl text-sm text-zinc-100 outline-none transition-all focus:border-red-500 focus:ring-1 focus:ring-red-500/50 placeholder:text-zinc-600"
              required
            />
          </div>
        )}

        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="email"
            placeholder="Seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 pl-11 pr-4 py-3.5 rounded-xl text-sm text-zinc-100 outline-none transition-all focus:border-red-500 focus:ring-1 focus:ring-red-500/50 placeholder:text-zinc-600"
            required
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="password"
            placeholder="Sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 pl-11 pr-4 py-3.5 rounded-xl text-sm text-zinc-100 outline-none transition-all focus:border-red-500 focus:ring-1 focus:ring-red-500/50 placeholder:text-zinc-600"
            required
          />
        </div>

        {erro && (
          <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg text-center mt-2">
            <p className="text-red-400 text-xs font-medium">{erro}</p>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-red-600 text-white py-4 rounded-xl text-sm font-bold mt-2 hover:bg-red-700 active:scale-[0.98] transition-all shadow-lg shadow-red-600/20"
        >
          {modo === "login" ? "ENTRAR NO SISTEMA" : "CADASTRAR E ACESSAR"}
        </button>
      </form>
    </div>
  );
};

export default TelaLogin;
