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

const API_URL = process.env.NODE_ENV === 'production' 
  ? "https://voxcity-backend.onrender.com" 
  : "http://localhost:3001";

export function Mapa({ denuncias, irParaDenuncia }) {
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
        
        <MapContainer 
          center={[-7.0229, -37.2818]} 
          zoom={13} 
          style={{ height: '100%', width: '100%', zIndex: 0 }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            className="grayscale invert opacity-80" 
          />
          
          {denuncias.map((d) => (
            d.latitude && d.longitude && (
              <Marker key={d.id} position={[d.latitude, d.longitude]}>
                <Popup>
                  <div className="flex flex-col gap-2 min-w-[160px] font-sans">
                    {d.fotoUrl && (
                      <img
                        src={
                          d.fotoUrl.startsWith("http")
                            ? d.fotoUrl
                            : `${API_URL}${d.fotoUrl.startsWith("/") ? "" : "/"}${d.fotoUrl}`
                        }
                        alt="Ocorrência"
                        className="w-full h-24 object-cover rounded-md border border-zinc-300 shadow-sm"
                      />
                    )}
                    
                    <strong className="block text-sm text-zinc-800 leading-tight">
                      {d.descricao.length > 50 ? `${d.descricao.substring(0, 50)}...` : d.descricao}
                    </strong>
                    
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px] text-zinc-500 max-w-[90px] truncate">
                        {d.endereco || 'Patos-PB'}
                      </span>
                      <span className="text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                        {d.apoios || 0} Apoios
                      </span>
                    </div>

                    <button
                      onClick={() => irParaDenuncia(d.id)}
                      className="mt-2 w-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 rounded-lg transition-colors shadow-sm"
                    >
                      Abrir no Feed
                    </button>
                  </div>
                </Popup>
              </Marker>
            )
          ))}
        </MapContainer>

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