import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navbar } from './components/Navbar';
import { Feed } from './components/Feed';
import { FormularioDenuncia } from './components/FormularioDenuncia';

function App() {
  const [pagina, setPagina] = useState('feed');
  const [denuncias, setDenuncias] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/denuncias')
      .then(res => res.json())
      .then(data => setDenuncias(data))
      .catch(err => console.error("Erro ao buscar:", err));
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans pb-24">
      
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