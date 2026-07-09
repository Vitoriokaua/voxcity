import React from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MarcadorDinamico({ posicao, setPosicao, setEndereco }) {
  useMapEvents({
    async click(e) {
      setPosicao(e.latlng);
      
      try {
        const resposta = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}`);
        const dados = await resposta.json();
        
        const endereco = dados.address;
        const bairro = endereco.suburb || endereco.neighbourhood || endereco.city_district || "";
        const cidade = endereco.city || endereco.town || endereco.village || "Patos";
        const localFormatado = bairro ? `${bairro}, ${cidade}` : cidade;
        
        setEndereco(localFormatado);
      } catch (error) {
        setEndereco("Endereço não encontrado");
      }
    },
  });
  return posicao === null ? null : <Marker position={posicao} />;
}

export function FormEtapaMapa({ posicao, setPosicao, setEndereco, onVoltar, onEnviar }) {
  return (
    <>
      <h2 className="text-lg font-semibold mb-2 text-white">Selecione o Local</h2>
      <p className="text-sm text-zinc-400 mb-4">Clique no mapa para marcar onde ocorreu o problema.</p>
      
      <div className="h-[250px] w-full rounded-xl overflow-hidden border border-zinc-700 mb-4 z-0">
        <MapContainer 
          center={[-7.0247, -37.2768]} 
          zoom={13} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap'
          />
          <MarcadorDinamico posicao={posicao} setPosicao={setPosicao} setEndereco={setEndereco} />
        </MapContainer>
      </div>

      <div className="flex gap-2">
        <button 
          onClick={onVoltar}
          className="w-1/3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 rounded-xl text-sm transition-all"
        >
          Voltar
        </button>
        <button 
          onClick={onEnviar}
          className="w-2/3 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl text-sm transition-all active:scale-95"
        >
          Finalizar Denúncia
        </button>
      </div>
    </>
  );
}