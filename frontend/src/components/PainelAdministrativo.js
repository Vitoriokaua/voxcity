import React, { useState } from "react";
import { MapPin, ImagePlus, ClipboardList, CheckCircle2 } from "lucide-react";
import { useAdmin } from "../hooks/useAdmin";

const API_URL = process.env.NODE_ENV === 'production' 
  ? "https://voxcity-backend.onrender.com" 
  : "http://localhost:3001";

const STATUS_LABEL = {
  PENDENTE: { texto: "Pendente", cor: "bg-red-600" },
  EM_ANALISE: { texto: "Em Análise", cor: "bg-yellow-500" },
  CONCLUIDA: { texto: "Concluída", cor: "bg-green-600" },
};

function CardAdmin({ denuncia: d, atualizarStatus, concluirDenuncia, enviandoId }) {
  const [fotoDepois, setFotoDepois] = useState(null);
  const [mostrarUpload, setMostrarUpload] = useState(false);

  const statusInfo = STATUS_LABEL[d.status] || STATUS_LABEL.PENDENTE;
  const estaEnviando = enviandoId === d.id;

  const confirmarConclusao = () => {
    if (!fotoDepois) return;
    concluirDenuncia(d.id, fotoDepois);
    setMostrarUpload(false);
    setFotoDepois(null);
  };

  return (
    <div className="w-full bg-zinc-900 p-4 rounded-xl border border-zinc-800 shadow-md flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-zinc-400">
          <MapPin className="w-4 h-4 text-red-500" />
          <span className="text-xs font-medium">{d.endereco || "Local não registrado"}</span>
        </div>
        <span className={`text-[10px] font-bold text-white px-2.5 py-1 rounded-full ${statusInfo.cor}`}>
          {statusInfo.texto}
        </span>
      </div>

      {d.fotoUrl && (
        <img
          src={d.fotoUrl.startsWith("http") ? d.fotoUrl : `${API_URL}${d.fotoUrl.startsWith("/") ? "" : "/"}${d.fotoUrl}`}
          alt="Ocorrência"
          className="w-full h-40 object-cover rounded-xl border border-zinc-800"
        />
      )}

      <p className="text-zinc-100 text-sm">{d.descricao}</p>

      {d.status !== 'CONCLUIDA' && (
        <div className="flex flex-col gap-2 border-t border-zinc-800 pt-3">
          <div className="flex gap-2">
            <button
              disabled={estaEnviando || d.status === 'PENDENTE'}
              onClick={() => atualizarStatus(d.id, 'PENDENTE')}
              className="flex-1 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-white text-xs font-bold py-2 rounded-lg transition-all"
            >
              Marcar Pendente
            </button>
            <button
              disabled={estaEnviando || d.status === 'EM_ANALISE'}
              onClick={() => atualizarStatus(d.id, 'EM_ANALISE')}
              className="flex-1 bg-yellow-600 hover:bg-yellow-700 disabled:opacity-40 text-white text-xs font-bold py-2 rounded-lg transition-all"
            >
              Marcar Em Análise
            </button>
          </div>

          {!mostrarUpload ? (
            <button
              onClick={() => setMostrarUpload(true)}
              className="w-full bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" /> Concluir com foto do "depois"
            </button>
          ) : (
            <div className="flex flex-col gap-2 bg-zinc-950 p-3 rounded-lg border border-zinc-800">
              <label className="flex items-center gap-2 cursor-pointer bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-2.5 px-3 rounded-lg text-xs transition-all border border-zinc-700">
                <ImagePlus className="w-4 h-4 text-zinc-400" />
                {fotoDepois ? fotoDepois.name : "Selecionar foto do 'depois'"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFotoDepois(e.target.files[0])}
                  className="hidden"
                />
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => { setMostrarUpload(false); setFotoDepois(null); }}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold py-2 rounded-lg transition-all"
                >
                  Cancelar
                </button>
                <button
                  disabled={!fotoDepois || estaEnviando}
                  onClick={confirmarConclusao}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-40 text-white text-xs font-bold py-2 rounded-lg transition-all"
                >
                  {estaEnviando ? "Enviando..." : "Confirmar Conclusão"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {d.status === 'CONCLUIDA' && d.fotoDepois && (
        <div className="grid grid-cols-2 gap-2 border-t border-zinc-800 pt-3">
          <div>
            <span className="text-[10px] text-zinc-500 font-bold uppercase">Antes</span>
            <img
              src={d.fotoUrl.startsWith("http") ? d.fotoUrl : `${API_URL}${d.fotoUrl.startsWith("/") ? "" : "/"}${d.fotoUrl}`}
              alt="Antes"
              className="w-full h-24 object-cover rounded-lg border border-zinc-800 mt-1"
            />
          </div>
          <div>
            <span className="text-[10px] text-green-500 font-bold uppercase">Depois</span>
            <img
              src={d.fotoDepois.startsWith("http") ? d.fotoDepois : `${API_URL}${d.fotoDepois.startsWith("/") ? "" : "/"}${d.fotoDepois}`}
              alt="Depois"
              className="w-full h-24 object-cover rounded-lg border border-green-800 mt-1"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export function PainelAdministrativo() {
  const { denuncias, carregando, enviandoId, atualizarStatus, concluirDenuncia } = useAdmin();

  return (
    <div className="w-full flex flex-col gap-4 mt-4 mb-24">
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
        <ClipboardList className="w-5 h-5 text-red-500" />
        <h2 className="text-lg font-bold text-white">Painel Administrativo</h2>
      </div>

      {carregando ? (
        <p className="text-center text-zinc-500 text-sm mt-6">Carregando denúncias...</p>
      ) : denuncias.length === 0 ? (
        <p className="text-center text-zinc-500 text-sm mt-6">Nenhuma denúncia registrada ainda.</p>
      ) : (
        denuncias.map((d) => (
          <CardAdmin
            key={d.id}
            denuncia={d}
            atualizarStatus={atualizarStatus}
            concluirDenuncia={concluirDenuncia}
            enviandoId={enviandoId}
          />
        ))
      )}
    </div>
  );
}