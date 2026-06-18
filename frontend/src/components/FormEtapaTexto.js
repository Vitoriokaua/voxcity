import React from 'react';
import { ImagePlus } from 'lucide-react';

export function FormEtapaTexto({ descricao, setDescricao, foto, setFoto, onAvancar }) {
  const verificarEAvancar = () => {
    if (descricao.trim() === '') {
      alert('Por favor, descreva a ocorrência antes de avançar.');
      return;
    }
  
    if (!foto) {
      alert('A foto da ocorrência é obrigatória!');
      return;
    }
    onAvancar();
  };

  return (
    <>
      <h2 className="text-lg font-semibold mb-4 text-white">Nova Ocorrência</h2>
      
      <textarea 
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        placeholder="Descreva o problema detalhadamente..."
        className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-4 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-red-500 transition min-h-[120px] resize-none mb-4"
      />

      <div className="mb-4">
        {}
        <label className="flex items-center gap-2 cursor-pointer bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-3 px-4 rounded-xl text-sm transition-all border border-zinc-700">
          <ImagePlus className="w-5 h-5 text-zinc-400" />
          {foto ? foto.name : 'Anexar uma Foto (Obrigatório)'}
          <input 
            type="file" 
            accept="image/*" 
            onChange={(e) => setFoto(e.target.files[0])} 
            className="hidden" 
          />
        </label>
      </div>

      <button 
        onClick={verificarEAvancar}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl text-sm transition-all active:scale-95"
      >
        Avançar para o Mapa
      </button>
    </>
  );
}