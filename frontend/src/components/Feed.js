import React, { useState } from 'react';
import { MapPin, User, AlertTriangle, CheckCircle } from 'lucide-react';

export function Feed({ denuncias }) {
  const usuarioLogado = JSON.parse(localStorage.getItem('usuario') || '{}');
  const ehModerador = usuarioLogado.role === 'MODERADOR';
  const [notasInput, setNotasInput] = useState({});

  const salvarNotaComunidade = async (idDenuncia) => {
    const textoNota = notasInput[idDenuncia];
    if (!textoNota || textoNota.trim() === '') {
      alert('Escreva alguma nota antes de salvar!');
      return;
    }

    const token = localStorage.getItem('token');

    try {
      const resposta = await fetch(`http://localhost:3001/denuncias/${idDenuncia}/nota`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ notaComunidade: textoNota })
      });

      if (resposta.ok) {
        alert('Nota sugerida com sucesso! Agora ela precisa do voto de outro moderador para aparecer publicamente.');
        setNotasInput({ ...notasInput, [idDenuncia]: '' });
      } else {
        alert('Erro ao adicionar nota.');
      }
    } catch (erro) {
      console.error('Erro ao conectar com o servidor:', erro);
    }
  };

  const validarNota = async (idDenuncia) => {
    const token = localStorage.getItem('token');

    try {
      const resposta = await fetch(`http://localhost:3001/denuncias/${idDenuncia}/nota/validar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (resposta.ok) {
        alert('Voto computado! Se for o segundo voto, a nota agora é pública.');
      } else {
        alert('Erro ao validar nota.');
      }
    } catch (erro) {
      console.error('Erro ao conectar com o servidor:', erro);
    }
  };

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
      {denuncias.map((d) => {
        
        const mostraNota = d.notaComunidade && (d.notaStatus === 'APROVADA' || ehModerador);

        return (
          <div key={d.id} className="w-full bg-zinc-900 p-4 rounded-xl border border-zinc-800 shadow-md flex flex-col gap-3">
            
            <div>
              <div className="flex items-center gap-2 mb-1 text-zinc-400">
                <User className="w-4 h-4 text-zinc-500" />
                <span className="text-xs font-bold text-zinc-300">
                  {d.anonimo ? "Anônimo" : (d.usuario?.nome || "Cidadão")}
                </span>
              </div>

              <div className="flex items-center gap-2 text-zinc-500">
                <MapPin className="w-4 h-4 text-red-500" />
                <span className="text-xs font-medium">
                  {d.endereco || 'Local não registrado'}
                </span>
              </div>
            </div>

            {d.fotoUrl && (
              <img 
                src={`http://localhost:3001${d.fotoUrl}`} 
                alt="Ocorrência" 
                className="w-full h-48 object-cover rounded-xl border border-zinc-800"
              />
            )}
            
            <p className="text-zinc-100 text-sm">{d.descricao}</p>

            {/* BOX DA NOTA DA COMUNIDADE */}
            {mostraNota && (
              <div className={`p-3 rounded-xl flex gap-3 items-start mt-2 border ${
                d.notaStatus === 'APROVADA' 
                  ? 'bg-amber-950/40 border-amber-800' 
                  : 'bg-blue-950/40 border-blue-800'
              }`}>
                <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${
                  d.notaStatus === 'APROVADA' ? 'text-amber-500' : 'text-blue-400'
                }`} />
                <div>
                  <h4 className={`text-xs font-bold uppercase tracking-wider mb-0.5 ${
                    d.notaStatus === 'APROVADA' ? 'text-amber-500' : 'text-blue-400'
                  }`}>
                    Nota da Comunidade {d.notaStatus === 'PENDENTE' && '(EM VALIDAÇÃO)'}
                  </h4>
                  <p className={`text-xs leading-relaxed ${
                    d.notaStatus === 'APROVADA' ? 'text-amber-200' : 'text-blue-200'
                  }`}>{d.notaComunidade}</p>
                  
                  {/* Botão de votar para outro moderador (Apenas se a nota estiver pendente) */}
                  {ehModerador && d.notaStatus === 'PENDENTE' && (
                    <button
                      onClick={() => validarNota(d.id)}
                      className="mt-2 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold py-1 px-3 rounded-lg flex items-center gap-1 transition-all"
                    >
                      <CheckCircle className="w-3 h-3" /> Validar e Apoiar Nota
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* CRIAÇÃO DE NOTA (Só aparece para moderador se o post não tiver nota nenhuma ainda) */}
            {ehModerador && !d.notaComunidade && (
              <div className="border-t border-zinc-800 pt-3 mt-2 flex flex-col gap-2">
                <span className="text-red-400 text-[10px] font-bold uppercase tracking-wider">Ferramentas de Moderação</span>
                <div className="flex gap-2">
                  <input 
                    type="text"
                    placeholder="Escreva uma nota de contexto para este post..."
                    value={notasInput[d.id] || ''}
                    onChange={(e) => setNotasInput({ ...notasInput, [d.id]: e.target.value })}
                    className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-red-500"
                  />
                  <button
                    onClick={() => salvarNotaComunidade(d.id)}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 rounded-lg transition-all"
                  >
                    Sugerir Nota
                  </button>
                </div>
              </div>
            )}

          </div>
        );
      })}
    </div>
  );
}