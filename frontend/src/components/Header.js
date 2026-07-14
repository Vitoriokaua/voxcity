import React from "react";
import { ShieldAlert, Search, LogIn } from "lucide-react";

export function Header({ usuario, setPagina }) {
  return (
    <header className="sticky top-0 px-5 py-4 border-b border-zinc-800 bg-black flex justify-between items-center z-50">
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2 text-white">
          <ShieldAlert className="text-red-500 w-6 h-6" />
          VoxCity
        </h1>
        <p className="text-xs text-zinc-400 font-medium mt-1">
          Feed de Denúncias
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Renderiza o botão apenas se NÃO houver usuário logado */}
        {!usuario && (
          <button
            onClick={() => setPagina("login")}
            className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold py-2 px-4 rounded-full transition-all border border-zinc-700"
          >
            <LogIn className="w-4 h-4" />
            Entrar
          </button>
        )}

        <button className="bg-zinc-800 p-2 rounded-full hover:bg-zinc-700 transition border border-zinc-700">
          <Search className="w-5 h-5 text-zinc-300" />
        </button>
      </div>
    </header>
  );
}
