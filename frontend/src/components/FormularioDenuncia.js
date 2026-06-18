import React, { useState } from 'react';
import { FormEtapaTexto } from './FormEtapaTexto';
import { FormEtapaMapa } from './FormEtapaMapa';

export function FormularioDenuncia() {
  const [descricao, setDescricao] = useState('');
  const [foto, setFoto] = useState(null);
  const [posicao, setPosicao] = useState(null);
  const [endereco, setEndereco] = useState(''); 
  const [etapa, setEtapa] = useState(1);

  const enviarDenuncia = async () => {
    if (!posicao) {
      alert('Por favor, clique no mapa para selecionar o local da ocorrência!');
      return;
    }

    const formData = new FormData();
    formData.append('descricao', descricao);
    formData.append('latitude', posicao.lat);
    formData.append('longitude', posicao.lng);
    formData.append('endereco', endereco); 
    
    if (foto) {
      formData.append('foto', foto);
    }

    try {
      const resposta = await fetch('http://localhost:3001/denuncias', {
        method: 'POST',
        body: formData,
      });
      
      if (resposta.ok) {
        alert('Denúncia enviada com sucesso!');
        setDescricao('');
        setFoto(null);
        setPosicao(null);
        setEndereco('');
        setEtapa(1);
      }
    } catch (erro) {
      console.error("Erro ao conectar com o servidor:", erro);
    }
  };

  return (
    <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl z-10">
      {etapa === 1 ? (
        <FormEtapaTexto 
          descricao={descricao} 
          setDescricao={setDescricao} 
          foto={foto}
          setFoto={setFoto}
          onAvancar={() => setEtapa(2)} 
        />
      ) : (
        <FormEtapaMapa 
          posicao={posicao} 
          setPosicao={setPosicao}
          setEndereco={setEndereco} 
          onVoltar={() => setEtapa(1)} 
          onEnviar={enviarDenuncia} 
        />
      )}
    </div>
  );
}