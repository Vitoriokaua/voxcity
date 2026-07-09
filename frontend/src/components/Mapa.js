import React from 'react';
import { AlertTriangle, MapPin, Layers } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export function Mapa({ denuncias }) {
  const totalOcorrencias = denuncias.length;

  return (
    <div className="w-full flex flex-col gap-4 mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold text-white">Mapa de Ocorrências</h2>
        <span className="bg-red-600/20 text-red-500 border border-red-600/30 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" /> {totalOcorrencias} Ativas
        </span>
      </div>

      <div className="w-full h-[60vh] bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden relative shadow-lg">
        
        {}
        <MapContainer 
          center={[-7.0229, -37.2818]} // Coordenadas centrais de Patos
          zoom={13} 
          style={{ height: '100%', width: '100%', zIndex: 0 }}
        >
          {}
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            className="grayscale invert opacity-80" 
          />
          
          {/* PERCORRENDO AS DENÚNCIAS E DESENHANDO OS PINOS */}
          {denuncias.map((d) => (
            d.latitude && d.longitude && (
              <Marker key={d.id} position={[d.latitude, d.longitude]}>
                <Popup>
                  <div className="text-zinc-800 font-sans">
                    <strong className="block mb-1 text-sm">{d.descricao}</strong>
                    <span className="text-xs text-zinc-500 block mb-1">{d.endereco || 'Patos-PB'}</span>
                    {/* Caso a denúncia tenha apoios, você pode exibir aqui também */}
                    <span className="text-[11px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full inline-block">
                      Apoios: {d.apoios || 0}
                    </span>
                  </div>
                </Popup>
              </Marker>
            )
          ))}
        </MapContainer>

        {/* PAINEL FLUTUANTE DE LEGENDA */}
        {}
        <div className="absolute bottom-4 left-4 right-4 bg-zinc-950/90 backdrop-blur-sm border border-zinc-800 p-3 rounded-xl flex items-center justify-between z-10 pointer-events-none">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-red-600 rounded-lg shadow-[0_0_10px_rgba(220,38,38,0.5)]">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-100">VoxCity Geocoding</p>
              <p className="text-[10px] text-zinc-400">Exibindo problemas em tempo real</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-medium text-zinc-400 bg-zinc-900 px-2 py-1 rounded-md border border-zinc-800">
            <Layers className="w-3 h-3" /> Foco: Patos - PB
          </div>
        </div>

      </div>

      {/* LISTA RÁPIDA ABAIXO DO MAPA */}
      <div className="flex flex-col gap-2 max-h-[15vh] overflow-y-auto pr-1">
        <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Últimos relatos no mapa</p>
        {denuncias.slice(0, 3).map((d) => (
          <div key={d.id} className="bg-zinc-900/50 border border-zinc-800/60 p-2 rounded-lg flex items-center justify-between text-xs">
            <span className="text-zinc-300 font-medium truncate max-w-[200px]">{d.descricao}</span>
            <span className="text-zinc-500 text-[10px] shrink-0 font-mono truncate max-w-[120px]">{d.endereco || "Patos-PB"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}