import { useState } from "react";

const API_URL = process.env.NODE_ENV === 'production' 
  ? "https://voxcity-backend.onrender.com" 
  : "http://localhost:3001";

export function useFeed() {
  const usuarioLogado = JSON.parse(localStorage.getItem("usuario") || "{}");
  const ehModerador = usuarioLogado.role === "MODERADOR";

  const [notasInput, setNotasInput] = useState({});
  const [acoesMod, setAcoesMod] = useState(() =>
    JSON.parse(localStorage.getItem("acoesMod") || "{}"),
  );

  const toggleLike = async (idDenuncia) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Você precisa estar logado para apoiar uma ocorrência.");
      return;
    }

    try {
      const resposta = await fetch(
        `${API_URL}/denuncias/${idDenuncia}/apoiar`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (resposta.ok) {
        window.location.reload();
      } else {
        const erro = await resposta.json();
        alert(erro.mensagem || "Erro ao apoiar ocorrência.");
      }
    } catch (erro) {
      console.error("Erro ao conectar com o servidor:", erro);
    }
  };

  const salvarNotaComunidade = async (idDenuncia) => {
    const textoNota = notasInput[idDenuncia];
    if (!textoNota || textoNota.trim() === "") {
      alert("Escreva alguma nota antes de salvar!");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const resposta = await fetch(
        `${API_URL}/denuncias/${idDenuncia}/nota`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ notaComunidade: textoNota }),
        },
      );

      if (resposta.ok) {
        const novasAcoes = { ...acoesMod, [idDenuncia]: "CRIOU" };
        setAcoesMod(novasAcoes);
        localStorage.setItem("acoesMod", JSON.stringify(novasAcoes));

        alert("Nota sugerida com sucesso!");
        window.location.reload();
      } else {
        alert("Erro ao adicionar nota.");
      }
    } catch (erro) {
      console.error("Erro ao conectar com o servidor:", erro);
    }
  };

  const validarNota = async (idDenuncia) => {
    const token = localStorage.getItem("token");

    try {
      const resposta = await fetch(
        `${API_URL}/denuncias/${idDenuncia}/nota/validar`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (resposta.ok) {
        const novasAcoes = { ...acoesMod, [idDenuncia]: "VOTOU" };
        setAcoesMod(novasAcoes);
        localStorage.setItem("acoesMod", JSON.stringify(novasAcoes));

        alert("Voto computado!");
        window.location.reload();
      } else {
        alert("Erro ao validar nota.");
      }
    } catch (erro) {
      console.error("Erro ao conectar com o servidor:", erro);
    }
  };

  return {
    ehModerador,
    notasInput,
    setNotasInput,
    toggleLike,
    acoesMod,
    salvarNotaComunidade,
    validarNota,
  };
}
