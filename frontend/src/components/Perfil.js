import React from 'react';
import { User, LogOut, ShieldAlert, Mail } from 'lucide-react';

export function Perfil() {
  
  const usuarioLogado = JSON.parse(localStorage.getItem('usuario') || '{}');

  const fazerLogout = () => {
    localStorage.clear(); 
    window.location.reload(); 
  };

  return (
    <div className="w-full flex flex-col gap-4 mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-xl font-bold text-white mb-2">Meu Perfil</h2>
      
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-md flex flex-col items-center gap-4">
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

        <div className="bg-zinc-950 w-full rounded-lg p-3 mt-2 flex justify-center items-center gap-2 border border-zinc-800">
          <ShieldAlert className="w-5 h-5 text-red-500" />
          <span className="text-sm font-bold text-zinc-300 uppercase tracking-wider">
            Cargo: <span className={usuarioLogado.role === 'MODERADOR' ? 'text-blue-400' : 'text-zinc-400'}>{usuarioLogado.role || 'Cidadão'}</span>
          </span>
        </div>
      </div>

      <button 
        onClick={fazerLogout}
        className="mt-4 w-full bg-red-600/10 hover:bg-red-600/20 text-red-500 border border-red-600/30 font-bold py-4 rounded-xl flex justify-center items-center gap-2 transition-all"
      >
        <LogOut className="w-5 h-5" />
        Sair da Conta
      </button>
    </div>
  );
}