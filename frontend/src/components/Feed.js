import React from "react";
import { MapPin } from "lucide-react";
import { useFeed } from "../hooks/useFeed";
import { ReportCard } from "./ReportCard";

export function Feed({ denuncias }) {
  const feedHooks = useFeed();

  if (denuncias.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 my-auto">
        <MapPin className="w-12 h-12 text-zinc-800" />
        <p className="text-zinc-500 text-sm">O feed está vazio.</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-3 mt-4 mb-24">
      {denuncias.map((d) => (
        <ReportCard key={d.id} denuncia={d} hooks={feedHooks} />
      ))}
    </div>
  );
}
