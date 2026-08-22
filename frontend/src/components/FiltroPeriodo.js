import React from "react";

const OPCOES = [
  { valor: "dia", label: "Hoje" },
  { valor: "semana", label: "Semana" },
  { valor: "mes", label: "Mês" },
  { valor: "ano", label: "Ano" },
  { valor: "todos", label: "Sempre" },
];

export function FiltroPeriodo({ periodoAtivo, setPeriodo }) {
  return (
    <div className="w-full flex gap-2 overflow-x-auto pb-1 mt-3">
      {OPCOES.map((opcao) => (
        <button
          key={opcao.valor}
          onClick={() => setPeriodo(opcao.valor)}
          className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all border ${
            periodoAtivo === opcao.valor
              ? "bg-red-600 border-red-600 text-white"
              : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
          }`}
        >
          {opcao.label}
        </button>
      ))}
    </div>
  );
}