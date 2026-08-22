import React, { useState, useRef } from "react";
import { MapPin } from "lucide-react";
import { useFeed } from "../hooks/useFeed";
import { ReportCard } from "./ReportCard";
import { FeedRelevantes } from "./FeedRelevantes";

export function Feed({ denuncias, setDenuncias }) {
  const feedHooks = useFeed(setDenuncias);
  const [abaAtiva, setAbaAtiva] = useState("recentes");
  const posicaoInicial = useRef({ x: null, y: null });

  const aoTocarInicio = (e) => {
    posicaoInicial.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const aoTocarFim = (e) => {
    if (posicaoInicial.current.x === null) return;

    const posicaoFinalX = e.changedTouches[0].clientX;
    const posicaoFinalY = e.changedTouches[0].clientY;

    const diferencaX = posicaoInicial.current.x - posicaoFinalX;
    const diferencaY = posicaoInicial.current.y - posicaoFinalY;

    const limiteMinimo = 50;
    const movimentoHorizontal = Math.abs(diferencaX);
    const movimentoVertical = Math.abs(diferencaY);

    // Só considera "arrastar pra trocar de aba" se o movimento for
    // claramente mais horizontal do que vertical (evita conflito com scroll)
    const foiSwipeHorizontal =
      movimentoHorizontal > limiteMinimo && movimentoHorizontal > movimentoVertical * 1.5;

    if (foiSwipeHorizontal) {
      if (diferencaX > 0 && abaAtiva === "recentes") {
        setAbaAtiva("relevantes");
      } else if (diferencaX < 0 && abaAtiva === "relevantes") {
        setAbaAtiva("recentes");
      }
    }

    posicaoInicial.current = { x: null, y: null };
  };

  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex bg-zinc-900 border border-zinc-800 rounded-full p-1 mt-2">
        <button
          onClick={() => setAbaAtiva("recentes")}
          className={`flex-1 py-2 rounded-full text-xs font-bold transition-all ${
            abaAtiva === "recentes"
              ? "bg-red-600 text-white"
              : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          Recentes
        </button>
        <button
          onClick={() => setAbaAtiva("relevantes")}
          className={`flex-1 py-2 rounded-full text-xs font-bold transition-all ${
            abaAtiva === "relevantes"
              ? "bg-red-600 text-white"
              : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          Mais Relevantes
        </button>
      </div>

      <div onTouchStart={aoTocarInicio} onTouchEnd={aoTocarFim} className="w-full">
        {abaAtiva === "recentes" ? (
          denuncias.length === 0 ? (
            <div className="flex flex-col items-center gap-2 my-auto mt-10">
              <MapPin className="w-12 h-12 text-zinc-800" />
              <p className="text-zinc-500 text-sm">O feed está vazio.</p>
            </div>
          ) : (
            <div className="w-full flex flex-col gap-3 mt-4 mb-24">
              {denuncias.map((d) => (
                <ReportCard key={d.id} denuncia={d} hooks={feedHooks} />
              ))}
            </div>
          )
        ) : (
          <FeedRelevantes />
        )}
      </div>
    </div>
  );
}