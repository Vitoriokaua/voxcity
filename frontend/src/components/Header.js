import React, { useState } from "react";
import { ShieldAlert, Search, LogIn, X } from "lucide-react";

export function Header({ usuario, setPagina, termoBusca, setTermoBusca }) {
  const [mostrarBusca, setMostrarBusca] = useState(false);

  const alternarBusca = () => {
    if (mostrarBusca) {
      setMostrarBusca(false);
      setTermoBusca(""); 
    } else {
      setMostrarBusca(true);
    }
  };

  return (
    <header className="sticky top-0 px-5 py-4 border-b border-zinc-800 bg-black flex justify-between items-center z-50">
      
      {!mostrarBusca && (
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2 text-white">
            <ShieldAlert className="text-red-500 w-6 h-6" />
            VoxCity
          </h1>
          <p className="text-xs text-zinc-400 font-medium mt-1">
            Feed de Denúncias
          </p>
        </div>
      )}

      {mostrarBusca && (
        <div className="flex-1 mr-4 animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              autoFocus
              placeholder="Buscar por título, local..."
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 text-white text-sm rounded-full py-2 pl-10 pr-4 outline-none focus:border-red-500 transition-colors placeholder:text-zinc-500"
            />
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        {!usuario && !mostrarBusca && (
          <button
            onClick={() => setPagina("login")}
            className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold py-2 px-4 rounded-full transition-all border border-zinc-700"
          >
            <LogIn className="w-4 h-4" />
            Entrar
          </button>
        )}

        <button 
          onClick={alternarBusca}
          className="bg-zinc-800 p-2 rounded-full hover:bg-zinc-700 transition border border-zinc-700"
        >
          {mostrarBusca ? (
            <X className="w-5 h-5 text-zinc-300" />
          ) : (
            <Search className="w-5 h-5 text-zinc-300" />
          )}
        </button>
      </div>
    </header>
  );
}
