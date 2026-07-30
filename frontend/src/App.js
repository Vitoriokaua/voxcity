import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Navbar } from "./components/Navbar";
import { Feed } from "./components/Feed";
import { FormularioDenuncia } from "./components/FormularioDenuncia";
import TelaLogin from "./components/TelaLogin";
import { Perfil } from "./components/Perfil";
import { Notificacoes } from "./components/Notificacoes";
import { Mapa } from "./components/Mapa";
import { useBusca } from "./components/useBusca";

const API_URL = process.env.NODE_ENV === 'production' 
  ? "https://voxcity-backend.onrender.com" 
  : "http://localhost:3001";

function App() {
  const [usuario, setUsuario] = useState(null);
  const [pagina, setPagina] = useState("feed");
  const [denuncias, setDenuncias] = useState([]);

  const { termoBusca, setTermoBusca, denunciasFiltradas } = useBusca(denuncias);

  useEffect(() => {
    const salvo = localStorage.getItem("usuario");
    if (salvo) setUsuario(JSON.parse(salvo));
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/denuncias`)
      .then((res) => res.json())
      .then((data) => setDenuncias(data))
      .catch((err) => console.error("Erro ao buscar:", err));
  }, []);

  const irParaDenuncia = (id) => {
    setPagina("feed");
    setTimeout(() => {
      const elemento = document.getElementById(`denuncia-${id}`);
      if (elemento) {
        elemento.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 150);
  };

  if (pagina === "login") {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <TelaLogin
          aoLogar={(u) => {
            setUsuario(u);
            setPagina("feed");
          }}
          aoVoltar={() => setPagina("feed")}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans pb-24 relative">
      <Header 
        usuario={usuario} 
        setPagina={setPagina} 
        termoBusca={termoBusca} 
        setTermoBusca={setTermoBusca} 
      />

      <main className="flex flex-col items-center justify-start min-h-[70vh] p-4 max-w-md mx-auto">
        {pagina === "feed" && <Feed denuncias={denunciasFiltradas} setDenuncias={setDenuncias} />}

        {pagina === "form" && (
          <div className="w-full flex justify-center mt-10">
            <FormularioDenuncia />
          </div>
        )}

        {pagina === "mapa" && <Mapa denuncias={denuncias} irParaDenuncia={irParaDenuncia} />}
        {pagina === "notificacoes" && <Notificacoes />}
        {pagina === "perfil" && <Perfil />}
      </main>

      <Navbar pagina={pagina} setPagina={setPagina} usuario={usuario} />
    </div>
  );
}

export default App;