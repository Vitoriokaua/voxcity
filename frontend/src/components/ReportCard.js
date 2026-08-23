import React, { useState } from "react";
import {
  MapPin,
  User,
  AlertTriangle,
  CheckCircle,
  ThumbsUp,
  MessageCircle,
  ThumbsDown,
} from "lucide-react";
import { ModalComentarios } from "./ModalComentarios";

const API_URL = process.env.NODE_ENV === 'production' 
  ? "https://voxcity-backend.onrender.com" 
  : "http://localhost:3001";

const STATUS_LABEL = {
  PENDENTE: { texto: "Pendente", cor: "bg-red-600" },
  EM_ANALISE: { texto: "Em Análise", cor: "bg-yellow-500" },
  CONCLUIDA: { texto: "Concluída", cor: "bg-green-600" },
};

const montarUrlFoto = (caminho) =>
  caminho.startsWith("http") ? caminho : `${API_URL}${caminho.startsWith("/") ? "" : "/"}${caminho}`;

export function ReportCard({ denuncia: d, hooks }) {
  const {
    ehModerador,
    notasInput,
    setNotasInput,
    toggleLike,
    acoesMod,
    salvarNotaComunidade,
    validarNota,
    confirmarResolucao,
  } = hooks;

  const [isModalAberto, setIsModalAberto] = useState(false);
  const usuarioLogado = JSON.parse(localStorage.getItem("usuario") || "{}");

  const mostraNota =
    d.notaComunidade && (d.notaStatus === "APROVADA" || ehModerador);
  const jaInteragiu = acoesMod[d.id] === "CRIOU" || acoesMod[d.id] === "VOTOU";
  const campoData = d.dataCriacao || d.criadoEm;
  const qtdApoios = d.apoios || 0;

  const jaCurtiu = d.curtiu !== undefined 
    ? d.curtiu 
    : d.apoiosDe?.some((apoio) => apoio.usuarioId === usuarioLogado.id);

  const statusAtual = d.status || "PENDENTE";
  const statusInfo = STATUS_LABEL[statusAtual] || STATUS_LABEL.PENDENTE;
  const estaConcluida = statusAtual === "CONCLUIDA";

  const confirmacoes = d.confirmacoes || [];
  const totalConfirmaram = confirmacoes.filter((c) => c.resolvido).length;
  const totalNegaram = confirmacoes.filter((c) => !c.resolvido).length;
  const meuVoto = confirmacoes.find((c) => c.usuarioId === usuarioLogado.id)?.resolvido;

  return (
    <>
      <div id={`denuncia-${d.id}`} className="w-full bg-zinc-900 p-4 rounded-xl border border-zinc-800 shadow-md flex flex-col gap-3">
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2 text-zinc-400">
              <User className="w-4 h-4 text-zinc-500" />
              <span className="text-xs font-bold text-zinc-300">
                {d.anonimo ? "Anônimo" : d.usuario?.nome || "Cidadão"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold text-white px-2.5 py-1 rounded-full ${statusInfo.cor}`}>
                {statusInfo.texto}
              </span>
              {campoData && (
                <span className="text-[10px] text-zinc-500 font-mono">
                  {new Date(campoData).toLocaleString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 text-zinc-500 mt-1">
            <MapPin className="w-4 h-4 text-red-500" />
            <span className="text-xs font-medium">
              {d.endereco || "Local não registrado"}
            </span>
          </div>
        </div>

        {estaConcluida && d.fotoDepois ? (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Antes</span>
              {d.fotoUrl && (
                <img
                  src={montarUrlFoto(d.fotoUrl)}
                  alt="Antes"
                  className="w-full h-32 object-cover rounded-xl border border-zinc-800 mt-1"
                />
              )}
            </div>
            <div>
              <span className="text-[10px] text-green-500 font-bold uppercase tracking-wider">Depois</span>
              <img
                src={montarUrlFoto(d.fotoDepois)}
                alt="Depois"
                className="w-full h-32 object-cover rounded-xl border border-green-800 mt-1"
              />
            </div>
          </div>
        ) : (
          d.fotoUrl && (
            <img
              src={montarUrlFoto(d.fotoUrl)}
              alt="Ocorrência"
              className="w-full h-48 object-cover rounded-xl border border-zinc-800"
            />
          )
        )}
        
        <p className="text-zinc-100 text-sm">{d.descricao}</p>

        <div className="flex items-center gap-6 border-t border-zinc-800/50 pt-3 mt-1">
          <button
            onClick={() => toggleLike(d.id)}
            className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${
              jaCurtiu 
                ? "text-red-500 hover:text-red-400" 
                : "text-zinc-500 hover:text-red-400"
            }`}
          >
            <ThumbsUp 
              className="w-4 h-4" 
              fill={jaCurtiu ? "currentColor" : "none"} 
            />
            <span>
              {qtdApoios} {qtdApoios === 1 ? "Apoio" : "Apoios"}
            </span>
          </button>

          <button
            onClick={() => setIsModalAberto(true)}
            className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Comentar</span>
          </button>
        </div>

        {estaConcluida && (
          <div className="bg-green-950/30 border border-green-800/50 rounded-xl p-3 flex flex-col gap-2">
            <span className="text-xs font-bold text-green-400">
              Essa denúncia foi marcada como resolvida. O problema foi realmente solucionado?
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => confirmarResolucao(d.id, true)}
                className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-bold py-2 rounded-lg transition-all ${
                  meuVoto === true
                    ? "bg-green-600 text-white"
                    : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" /> Sim ({totalConfirmaram})
              </button>
              <button
                onClick={() => confirmarResolucao(d.id, false)}
                className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-bold py-2 rounded-lg transition-all ${
                  meuVoto === false
                    ? "bg-red-600 text-white"
                    : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                }`}
              >
                <ThumbsDown className="w-3.5 h-3.5" /> Não ({totalNegaram})
              </button>
            </div>
          </div>
        )}

        {mostraNota && (
          <div
            className={`p-3 rounded-xl flex gap-3 items-start mt-2 border ${d.notaStatus === "APROVADA" ? "bg-amber-950/40 border-amber-800" : "bg-blue-950/40 border-blue-800"}`}
          >
            <AlertTriangle
              className={`w-5 h-5 shrink-0 mt-0.5 ${d.notaStatus === "APROVADA" ? "text-amber-500" : "text-blue-400"}`}
            />
            <div>
              <h4
                className={`text-xs font-bold uppercase tracking-wider mb-0.5 ${d.notaStatus === "APROVADA" ? "text-amber-500" : "text-blue-400"}`}
              >
                Nota da Comunidade{" "}
                {d.notaStatus === "PENDENTE" && "(EM VALIDAÇÃO)"}
              </h4>
              <p
                className={`text-xs leading-relaxed ${d.notaStatus === "APROVADA" ? "text-amber-200" : "text-blue-200"}`}
              >
                {d.notaComunidade}
              </p>

              {ehModerador && d.notaStatus === "PENDENTE" && !jaInteragiu && (
                <button
                  onClick={() => validarNota(d.id)}
                  className="mt-2 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold py-1.5 px-3 rounded-lg flex items-center gap-1 transition-all"
                >
                  <CheckCircle className="w-3 h-3" /> Validar e Apoiar Nota
                </button>
              )}
            </div>
          </div>
        )}

        {ehModerador && !d.notaComunidade && !jaInteragiu && (
          <div className="border-t border-zinc-800 pt-3 mt-2 flex flex-col gap-2">
            <span className="text-red-400 text-[10px] font-bold uppercase tracking-wider">
              Ferramentas de Moderação
            </span>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Escreva uma nota de contexto para este post..."
                value={notasInput[d.id] || ""}
                onChange={(e) =>
                  setNotasInput({ ...notasInput, [d.id]: e.target.value })
                }
                className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-red-500"
              />
              <button
                onClick={() => salvarNotaComunidade(d.id)}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 rounded-lg transition-all"
              >
                Sugerir Nota
              </button>
            </div>
          </div>
        )}
      </div>

      {isModalAberto && (
        <ModalComentarios
          fecharModal={() => setIsModalAberto(false)}
          denunciaId={d.id}
        />
      )}
    </>
  );
}