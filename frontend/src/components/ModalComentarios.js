import React, { useState } from "react";
import { X, Send, User } from "lucide-react";

export function ModalComentarios({ fecharModal, denunciaId }) {
  // MOCK DE COMENTÁRIOS: Simulando o que viria do banco de dados
  const [comentarios, setComentarios] = useState([
    {
      id: 1,
      usuario: "Maria Silva",
      texto: "Isso é um absurdo! A prefeitura precisa arrumar logo.",
      criadoEm: new Date().toISOString(),
    },
    {
      id: 2,
      usuario: "João Pedro",
      texto: "Passei aí ontem e quase quebrei o pneu da moto.",
      criadoEm: new Date(Date.now() - 3600000).toISOString(),
    },
  ]);

  const [novoComentario, setNovoComentario] = useState("");

  const enviarComentario = (e) => {
    e.preventDefault();
    if (!novoComentario.trim()) return;

    // Adiciona o comentário falso na tela (MOCK)
    const comentarioCriado = {
      id: Date.now(),
      usuario: "Você",
      texto: novoComentario,
      criadoEm: new Date().toISOString(),
    };

    setComentarios([...comentarios, comentarioCriado]);
    setNovoComentario("");
  };

  return (
    // Fundo escuro (Overlay)
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex justify-center items-end sm:items-center p-4">
      {/* Janela do Modal */}
      <div className="bg-zinc-900 w-full max-w-md rounded-3xl border border-zinc-800 shadow-2xl flex flex-col h-[70vh] sm:h-[60vh] animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300">
        {/* CABEÇALHO DO MODAL */}
        <div className="flex justify-between items-center p-5 border-b border-zinc-800">
          <h2 className="text-zinc-100 font-bold text-lg">Comentários</h2>
          <button
            onClick={fecharModal}
            className="p-2 bg-zinc-800/50 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* LISTA DE COMENTÁRIOS (Scrollável) */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
          {comentarios.length === 0 ? (
            <p className="text-center text-zinc-500 text-sm mt-4">
              Nenhum comentário ainda. Seja o primeiro a comentar!
            </p>
          ) : (
            comentarios.map((com) => (
              <div
                key={com.id}
                className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800/50"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-zinc-600" />
                    <span className="text-xs font-bold text-zinc-300">
                      {com.usuario}
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-600 font-mono">
                    {new Date(com.criadoEm).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="text-zinc-300 text-sm leading-relaxed">
                  {com.texto}
                </p>
              </div>
            ))
          )}
        </div>

        {/* ÁREA DE DIGITAÇÃO */}
        <form
          onSubmit={enviarComentario}
          className="p-4 border-t border-zinc-800 bg-zinc-950/50 rounded-b-3xl flex gap-2"
        >
          <input
            type="text"
            placeholder="Escreva um comentário..."
            value={novoComentario}
            onChange={(e) => setNovoComentario(e.target.value)}
            className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-all"
          />
          <button
            type="submit"
            disabled={!novoComentario.trim()}
            className="bg-red-600 hover:bg-red-700 disabled:bg-zinc-800 disabled:text-zinc-600 text-white p-3 rounded-xl transition-all flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
