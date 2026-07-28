import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Navbar } from "./components/Navbar";
import { Feed } from "./components/Feed";
import { FormularioDenuncia } from "./components/FormularioDenuncia";
import TelaLogin from "./components/TelaLogin";
import { Perfil } from "./components/Perfil";
import { Notificacoes } from "./components/Notificacoes";
import { Mapa } from "./components/Mapa";

// MOCK DE DADOS PARA TESTE
const denunciasMock = [
  {
    id: 1,
    anonimo: false,
    usuario: { nome: "Carlos Eduardo" },
    dataCriacao: new Date().toISOString(),
    endereco: "Rua das Flores, 123 - Centro",
    descricao:
      "Buraco enorme na via, causando risco aos motoristas. Já furou o pneu de dois carros só na parte da manhã.",
    apoios: 12,
    fotoUrl: null, // Deixamos null para não quebrar a imagem de localhost inexistente
  },
  {
    id: 2,
    anonimo: true,
    dataCriacao: new Date(Date.now() - 86400000).toISOString(), // 1 dia atrás
    endereco: "Praça da Matriz",
    descricao:
      "Lâmpadas queimadas há mais de uma semana. O local está muito escuro e perigoso para pedestres à noite.",
    apoios: 42,
    notaComunidade:
      "A prefeitura informou que a troca da fiação e das lâmpadas será feita na próxima sexta-feira.",
    notaStatus: "APROVADA",
    fotoUrl: null,
  },
  {
    id: 3,
    anonimo: false,
    usuario: { nome: "Mariana Souza" },
    dataCriacao: new Date(Date.now() - 172800000).toISOString(), // 2 dias atrás
    endereco: "Avenida Principal, cruzamento com a Rua 5",
    descricao:
      "Semáforo quebrado piscando no amarelo, trânsito completamente caótico no horário de pico.",
    apoios: 0,
    notaComunidade:
      "Equipe de trânsito já foi acionada e está a caminho do local para desvio.",
    notaStatus: "PENDENTE",
    fotoUrl: null,
  },
];

function App() {
  const [usuario, setUsuario] = useState(null);
  const [pagina, setPagina] = useState("feed");

  // Iniciamos o estado já com o nosso Mock!
  const [denuncias, setDenuncias] = useState(denunciasMock);

  useEffect(() => {
    const salvo = localStorage.getItem("usuario");
    if (salvo) setUsuario(JSON.parse(salvo));
  }, []);

  /* CÓDIGO DA API COMENTADO TEMPORARIAMENTE
  useEffect(() => {
    fetch('http://localhost:3001/denuncias')
      .then(res => res.json())
      .then(data => setDenuncias(data))
      .catch(err => console.error("Erro ao buscar:", err));
  }, []);
  */

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
      <Header usuario={usuario} setPagina={setPagina} />

      <main className="flex flex-col items-center justify-start min-h-[70vh] p-4 max-w-md mx-auto">
        {pagina === "feed" && <Feed denuncias={denuncias} />}

        {pagina === "form" && (
          <div className="w-full flex justify-center mt-10">
            <FormularioDenuncia />
          </div>
        )}

        {pagina === "mapa" && <Mapa denuncias={denuncias} />}
        {pagina === "notificacoes" && <Notificacoes />}
        {pagina === "perfil" && <Perfil />}
      </main>

      <Navbar pagina={pagina} setPagina={setPagina} usuario={usuario} />
    </div>
  );
}

export default App;
