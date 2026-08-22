import React from "react";
import { Trophy } from "lucide-react";
import { useFeed } from "../hooks/useFeed";
import { useRelevantes } from "../hooks/useRelevantes";
import { ReportCard } from "./ReportCard";
import { FiltroPeriodo } from "./FiltroPeriodo";

export function FeedRelevantes() {
  const {
    periodo,
    setPeriodo,
    denunciasRelevantes,
    setDenunciasRelevantes,
    carregando,
  } = useRelevantes();

  const feedHooks = useFeed(setDenunciasRelevantes);

  return (
    <div className="w-full flex flex-col">
      <FiltroPeriodo periodoAtivo={periodo} setPeriodo={setPeriodo} />

      {carregando ? (
        <p className="text-center text-zinc-500 text-sm mt-8">Carregando ranking...</p>
      ) : denunciasRelevantes.length === 0 ? (
        <div className="flex flex-col items-center gap-2 mt-10">
          <Trophy className="w-12 h-12 text-zinc-800" />
          <p className="text-zinc-500 text-sm">Nenhuma denúncia com apoios nesse período.</p>
        </div>
      ) : (
        <div className="w-full flex flex-col gap-3 mt-4 mb-24">
          {denunciasRelevantes.map((d) => (
            <ReportCard key={d.id} denuncia={d} hooks={feedHooks} />
          ))}
        </div>
      )}
    </div>
  );
}