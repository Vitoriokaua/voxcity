import React, { useState, useEffect } from 'react';
import { User, LogOut, Mail, Trash2, Edit3, MapPin, Check, X, Grid } from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = process.env.NODE_ENV === 'production' 
  ? "https://voxcity-backend.onrender.com" 
  : "http://localhost:3001";

export function Perfil() {
  const usuarioLogado = JSON.parse(localStorage.getItem('usuario') || '{}');
  const [minhasDenuncias, setMinhasDenuncias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [editandoId, setEditandoId] = useState(null);
  const [textoEdicao, setTextoEdicao] = useState("");
  const [postAberto, setPostAberto] = useState(null);

  useEffect(() => {
    buscarMinhasDenuncias();
  }, []);

  const buscarMinhasDenuncias = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/denuncias/minhas`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMinhasDenuncias(data);
      }
    } catch (error) {
      toast.error("Erro ao carregar publicações.");
    } finally {
      setCarregando(false);
    }
  };

  const fazerLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  const iniciarEdicao = (d) => {
    setEditandoId(d.id);
    setTextoEdicao(d.descricao);
  };

  const salvarEdicao = async (id) => {
    const token = localStorage.getItem("token");
    if (!textoEdicao.trim()) {
      toast.error("A descrição não pode ficar vazia.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/denuncias/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ descricao: textoEdicao })
      });

      if (res.ok) {
        toast.success("Publicação atualizada!");
        setMinhasDenuncias(prev =>
          prev.map(item => item.id === id ? { ...item, descricao: textoEdicao } : item)
        );
        setPostAberto(prev => ({ ...prev, descricao: textoEdicao }));
        setEditandoId(null);
      } else {
        toast.error("Erro ao atualizar publicação.");
      }
    } catch (error) {
      toast.error("Erro de conexão.");
    }
  };

  const excluirDenuncia = async (id) => {
    if (!window.confirm("Tem certeza que deseja apagar esta denúncia?")) return;

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API_URL}/denuncias/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        toast.success("Denúncia removida!");
        setMinhasDenuncias(prev => prev.filter(item => item.id !== id));
        setPostAberto(null);
      } else {
        toast.error("Erro ao excluir denúncia.");
      }
    } catch (error) {
      toast.error("Erro de conexão.");
    }
  };

  const fecharPost = () => {
    setPostAberto(null);
    setEditandoId(null);
  };

  return (
    <div className="w-full flex flex-col gap-6 mt-4 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-md flex flex-col items-center gap-4">
        <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center border-2 border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.3)]">
          <User className="w-10 h-10 text-red-500" />
        </div>
        
        <div className="text-center">
          <h3 className="text-xl font-bold text-zinc-100">{usuarioLogado.nome || 'Usuário'}</h3>
          <div className="flex items-center justify-center gap-1 text-zinc-400 mt-1">
            <Mail className="w-4 h-4" />
            <span className="text-sm">{usuarioLogado.email || 'email@voxcity.com'}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full pt-2 border-t border-zinc-800/80 mt-1 text-center">
          <div className="flex-1">
            <span className="block text-lg font-black text-white">{minhasDenuncias.length}</span>
            <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Publicações</span>
          </div>
          <div className="w-[1px] h-8 bg-zinc-800"></div>
          <div className="flex-1">
            <span className="block text-xs font-bold text-zinc-300 uppercase mt-1">
              <span className={usuarioLogado.role === 'MODERADOR' ? 'text-blue-400' : 'text-zinc-400'}>
                {usuarioLogado.role || 'Cidadão'}
              </span>
            </span>
            <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Cargo</span>
          </div>
        </div>

        <button 
          onClick={fazerLogout}
          className="w-full bg-red-600/10 hover:bg-red-600/20 text-red-500 border border-red-600/30 font-bold py-2.5 rounded-xl flex justify-center items-center gap-2 transition-all text-xs"
        >
          <LogOut className="w-4 h-4" />
          Sair da Conta
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-center gap-2 border-b border-zinc-800 pb-3">
          <Grid className="w-4 h-4 text-zinc-400" />
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Minhas Publicações</h3>
        </div>

        {carregando ? (
          <p className="text-zinc-500 text-xs text-center py-6">Carregando suas denúncias...</p>
        ) : minhasDenuncias.length === 0 ? (
          <div className="text-center mt-4">
            <p className="text-zinc-500 text-sm">Você ainda não fez nenhuma publicação.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1">
            {minhasDenuncias.map((d) => (
              <div 
                key={d.id} 
                onClick={() => setPostAberto(d)}
                className="aspect-square bg-zinc-900 cursor-pointer overflow-hidden group relative"
              >
                {d.fotoUrl ? (
                  <img
                    src={d.fotoUrl.startsWith("http") ? d.fotoUrl : `${API_URL}${d.fotoUrl.startsWith("/") ? "" : "/"}${d.fotoUrl}`}
                    alt="Denúncia"
                    className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                  />
                ) : (
                  <div className="w-full h-full p-2 flex items-center justify-center text-center group-hover:bg-zinc-800 transition-colors">
                    <p className="text-[10px] text-zinc-500 line-clamp-3">{d.descricao}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {postAberto && (
        <div className="fixed inset-0 bg-black/95 z-[100] flex flex-col animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-950">
            <button onClick={fecharPost} className="p-2 text-zinc-400 hover:text-white transition">
              <X className="w-6 h-6" />
            </button>
            <span className="text-zinc-100 font-bold text-sm uppercase tracking-wider">Detalhes</span>
            <div className="w-10"></div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 max-w-md mx-auto w-full">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-md flex flex-col gap-4">
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-red-500" />
                  <span>{postAberto.endereco || "Local não informado"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => iniciarEdicao(postAberto)} className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition" title="Editar">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button onClick={() => excluirDenuncia(postAberto.id)} className="p-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 rounded-lg transition border border-red-600/20" title="Excluir">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {postAberto.fotoUrl && (
                <img
                  src={postAberto.fotoUrl.startsWith("http") ? postAberto.fotoUrl : `${API_URL}${postAberto.fotoUrl.startsWith("/") ? "" : "/"}${postAberto.fotoUrl}`}
                  alt="Foto da denúncia"
                  className="w-full max-h-80 object-contain bg-black rounded-lg border border-zinc-800"
                />
              )}

              {editandoId === postAberto.id ? (
                <div className="flex flex-col gap-2 mt-2">
                  <textarea
                    value={textoEdicao}
                    onChange={(e) => setTextoEdicao(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-sm text-zinc-100 outline-none focus:border-red-500 resize-none min-h-[100px]"
                  />
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => setEditandoId(null)} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold rounded-lg flex items-center gap-1 transition">
                      <X className="w-4 h-4" /> Cancelar
                    </button>
                    <button onClick={() => salvarEdicao(postAberto.id)} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg flex items-center gap-1 transition">
                      <Check className="w-4 h-4" /> Salvar
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-zinc-200 text-sm leading-relaxed whitespace-pre-wrap">{postAberto.descricao}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}