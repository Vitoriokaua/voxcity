import React from 'react';
import { MapPin, PlusCircle, Home, Bell, User } from 'lucide-react';

export function Navbar({ pagina, setPagina }) {
  return (
    <nav className="fixed bottom-0 w-full bg-black border-t border-zinc-800 px-6 py-4 flex justify-between items-center z-50">
      <button onClick={() => setPagina('feed')} className={`${pagina === 'feed' ? 'text-white' : 'text-zinc-500'} transition`}>
        <Home className="w-6 h-6" />
      </button>
      
      <button className="text-zinc-500 hover:text-zinc-300 transition">
        <MapPin className="w-6 h-6" />
      </button>

      <button 
        onClick={() => setPagina('form')} 
        className="bg-red-600 hover:bg-red-700 text-white rounded-full p-4 transform -translate-y-6 shadow-[0_0_20px_rgba(220,38,38,0.4)] border-4 border-black transition"
      >
        <PlusCircle className="w-8 h-8" />
      </button>

      <button className="text-zinc-500 hover:text-zinc-300 transition">
        <Bell className="w-6 h-6" />
      </button>

      <button className="text-zinc-500 hover:text-zinc-300 transition">
        <User className="w-6 h-6" />
      </button>
    </nav>
  );
}