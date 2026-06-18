import React from 'react';
import { ShieldAlert, Search } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 px-5 py-4 border-b border-zinc-800 bg-black flex justify-between items-center z-50">
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2 text-white">
          <ShieldAlert className="text-red-500 w-6 h-6" />
          VoxCity
        </h1>
        <p className="text-xs text-zinc-400 font-medium mt-1">Feed de Denúncias</p>
      </div>
      <button className="bg-zinc-800 p-2 rounded-full hover:bg-zinc-700 transition">
        <Search className="w-5 h-5 text-zinc-300" />
      </button>
    </header>
  );
}