import { useState } from "react";

export function useFeed() {
  const usuarioLogado = JSON.parse(localStorage.getItem("usuario") || "{}");
  const ehModerador = usuarioLogado.role === "MODERADOR";

  const [notasInput, setNotasInput] = useState({});
  const [acoesMod, setAcoesMod] = useState(() =>
    JSON.parse(localStorage.getItem("acoesMod") || "{}"),
  );

  // MOCK: Estado local para gerenciar as curtidas enquanto a API está offline
  const [apoiosMock, setApoiosMock] = useState({});

  // Recebe também a quantidadeAtual para o mock saber de onde começar a somar
  const toggleLike = async (idDenuncia, quantidadeAtual) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Você precisa estar logado para apoiar uma ocorrência.");
      return;
    }

    // --- INÍCIO DO MOCK ---
    console.log(`[MOCK] Simulando POST para /denuncias/${idDenuncia}/apoiar`);

    setApoiosMock((prev) => {
      // Verifica se o usuário já curtiu essa denúncia no nosso mock
      const estadoAtual = prev[idDenuncia] || {
        total: quantidadeAtual,
        curtiu: false,
      };

      // Simula o toggle (curtir / descurtir)
      return {
        ...prev,
        [idDenuncia]: {
          total: estadoAtual.curtiu
            ? estadoAtual.total - 1
            : estadoAtual.total + 1,
          curtiu: !estadoAtual.curtiu,
        },
      };
    });
    // --- FIM DO MOCK ---

    /* CÓDIGO ORIGINAL DA API (Comentado até a API voltar)
    try {
      const resposta = await fetch(`http://localhost:3001/denuncias/${idDenuncia}/apoiar`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (resposta.ok) {
        window.location.reload(); 
      } else {
        const erro = await resposta.json();
        alert(erro.mensagem || 'Erro ao apoiar ocorrência.');
      }
    } catch (erro) {
      console.error('Erro ao conectar com o servidor:', erro);
    }
    */
  };

  const salvarNotaComunidade = async (idDenuncia) => {
    // Mantive o código original aqui, se quiser testar a nota, pode fazer o mesmo esquema de mock!
    console.log(`[MOCK] Simulando salvar nota para ${idDenuncia}`);
    alert("Mock: Nota salva com sucesso!");
  };

  const validarNota = async (idDenuncia) => {
    console.log(`[MOCK] Simulando validar nota para ${idDenuncia}`);
    alert("Mock: Voto computado com sucesso!");
  };

  return {
    ehModerador,
    notasInput,
    setNotasInput,
    toggleLike,
    acoesMod,
    salvarNotaComunidade,
    validarNota,
    apoiosMock,
  };
}
