import React from "react";
import {
  MapPin,
  User,
  AlertTriangle,
  CheckCircle,
  ThumbsUp,
} from "lucide-react";

export function ReportCard({ denuncia: d, hooks }) {
  const {
    ehModerador,
    notasInput,
    setNotasInput,
    likes,
    toggleLike,
    acoesMod,
    salvarNotaComunidade,
    validarNota,
  } = hooks;

  const mostraNota =
    d.notaComunidade && (d.notaStatus === "APROVADA" || ehModerador);
  const jaInteragiu = acoesMod[d.id] === "CRIOU" || acoesMod[d.id] === "VOTOU";
  const campoData = d.dataCriacao || d.criadoEm;
  
  
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

  return (
    <div className="w-full bg-zinc-900 p-4 rounded-xl border border-zinc-800 shadow-md flex flex-col gap-3">
      {/* CABEÇALHO */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2 text-zinc-400">
            <User className="w-4 h-4 text-zinc-500" />
            <span className="text-xs font-bold text-zinc-300">
              {d.anonimo ? "Anônimo" : d.usuario?.nome || "Cidadão"}
            </span>
          </div>
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
        <div className="flex items-center gap-2 text-zinc-500 mt-1">
          <MapPin className="w-4 h-4 text-red-500" />
          <span className="text-xs font-medium">
            {d.endereco || "Local não registrado"}
          </span>
        </div>
      </div>

      {/* IMAGEM E DESCRIÇÃO */}
      {d.fotoUrl && (
        <img
          // 2️⃣ TROCAMOS O LOCALHOST PELA VARIÁVEL AQUI:
          src={d.fotoUrl.startsWith('http') ? d.fotoUrl : `${API_URL}${d.fotoUrl}`}
          alt="Ocorrência"
          className="w-full h-48 object-cover rounded-xl border border-zinc-800"
        />
      )}
      <p className="text-zinc-100 text-sm">{d.descricao}</p>

      {/* APOIAR */}
      <div className="flex items-center gap-4 border-t border-zinc-800/50 pt-2 mt-1">
        <button
          onClick={() => toggleLike(d.id)}
          className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${likes[d.id] ? "text-red-500" : "text-zinc-500 hover:text-zinc-300"}`}
        >
          <ThumbsUp
            className={`w-4 h-4 ${likes[d.id] ? "fill-red-500" : ""}`}
          />
          {likes[d.id] ? "Apoiado" : "Apoiar ocorrência"}
        </button>
      </div>

      {/* NOTA DA COMUNIDADE */}
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

            {ehModerador && d.notaStatus === "PENDENTE" && jaInteragiu && (
              <span className="text-[10px] text-zinc-500 mt-2 flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-zinc-600" /> Você já
                interagiu com esta nota.
              </span>
            )}
          </div>
        </div>
      )}

      {/* FERRAMENTAS MODERADOR */}
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
  );
}