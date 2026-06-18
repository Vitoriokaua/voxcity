import React from 'react';
import { MapPin } from 'lucide-react';

export function Feed({ denuncias }) {
  if (denuncias.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 my-auto">
        <MapPin className="w-12 h-12 text-zinc-800" />
        <p className="text-zinc-500 text-sm">O feed está vazio.</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-3 mt-4">
      {denuncias.map((d) => (
        <div key={d.id} className="w-full bg-zinc-900 p-4 rounded-xl border border-zinc-800 shadow-md">
          
          {}
          <div className="flex items-center gap-2 mb-3 text-zinc-400">
            <MapPin className="w-4 h-4 text-red-500" />
            <span className="text-xs font-medium">
              {d.endereco 
                ? d.endereco 
                : (d.latitude && d.longitude 
                    ? `${d.latitude.toFixed(4)}, ${d.longitude.toFixed(4)}` 
                    : 'Local não registrado')}
            </span>
          </div>

          {/* IMAGEM DA DENÚNCIA */}
          {d.fotoUrl && (
            <img 
              src={`http://localhost:3001${d.fotoUrl}`} 
              alt="Ocorrência" 
              className="w-full h-48 object-cover rounded-xl mb-3 border border-zinc-800"
            />
          )}
          
          <p className="text-zinc-100 text-sm">{d.descricao}</p>
        </div>
      ))}
    </div>
  );
}