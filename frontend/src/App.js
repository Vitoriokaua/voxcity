import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navbar } from './components/Navbar';
import { Feed } from './components/Feed';
import { FormularioDenuncia } from './components/FormularioDenuncia';
import TelaLogin from './components/TelaLogin'; 

function App() {
  const [usuario, setUsuario] = useState(null); // Estado para saber quem tá logado
  const [pagina, setPagina] = useState('feed');
  const [denuncias, setDenuncias] = useState([]);


  useEffect(() => {
    const salvo = localStorage.getItem('usuario');
    if (salvo) setUsuario(JSON.parse(salvo));
  }, []);


  useEffect(() => {
    fetch('http://localhost:3001/denuncias')
      .then(res => res.json())
      .then(data => setDenuncias(data))
      .catch(err => console.error("Erro ao buscar:", err));
  }, []);

  if (!usuario) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <TelaLogin aoLogar={(u) => setUsuario(u)} />
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans pb-24 relative">
      
      {}
      <button 
        onClick={() => { localStorage.clear(); setUsuario(null); }}
        className="absolute top-4 right-4 text-xs text-zinc-500 hover:text-zinc-300 underline z-50"
      >
        Sair
      </button>

      <Header />

      <main className="flex flex-col items-center justify-start min-h-[70vh] p-4 max-w-md mx-auto">
        {pagina === 'feed' ? (
          <Feed denuncias={denuncias} />
        ) : (
          <div className="w-full flex justify-center mt-10">
             <FormularioDenuncia />
          </div>
        )}
      </main>

      <Navbar pagina={pagina} setPagina={setPagina} />

    </div>
  );
}

export default App;