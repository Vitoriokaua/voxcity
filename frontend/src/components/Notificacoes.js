import React from 'react';
import { BellRing } from 'lucide-react';

export function Notificacoes() {
  return (
    <div className="w-full flex flex-col items-center justify-center h-[60vh] gap-4 animate-in fade-in zoom-in-95 duration-500">
      <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800 animate-pulse">
        <BellRing className="w-10 h-10 text-zinc-600" />
      </div>
      <h2 className="text-lg font-bold text-white text-center">Nenhuma notificação nova</h2>
      <p className="text-sm text-zinc-500 text-center max-w-[250px]">
        Avisaremos você quando a sua denúncia for resolvida ou receber notas da comunidade.
      </p>
    </div>
  );
}