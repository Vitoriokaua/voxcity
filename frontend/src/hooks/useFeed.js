import { useState } from "react";
import toast from "react-hot-toast"; 
const API_URL = process.env.NODE_ENV === 'production' 
  ? "https://voxcity-backend.onrender.com" 
  : "http://localhost:3001";


export function useFeed(setDenuncias) {
  const usuarioLogado = JSON.parse(localStorage.getItem("usuario") || "{}");
  const ehModerador = usuarioLogado.role === "MODERADOR";

  const [notasInput, setNotasInput] = useState({});
  const [acoesMod, setAcoesMod] = useState(() =>
    JSON.parse(localStorage.getItem("acoesMod") || "{}"),
  );

  const toggleLike = async (idDenuncia) => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Você precisa estar logado para apoiar uma ocorrência.");
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
        const dados = await resposta.json();
        
        // Atualiza SÓ a denúncia que recebeu/perdeu o like no estado do React
        setDenuncias((prev) => 
          prev.map((d) => 
            d.id === idDenuncia 
              ? { ...d, apoios: dados.denunciaAtualizada.apoios, curtiu: dados.curtiu } 
              : d
          )
        );

        if (dados.curtiu) {
           toast.success("Apoio registrado!");
        }
      } else {
        const erro = await resposta.json();
        toast.error(erro.erro || "Erro ao apoiar ocorrência.");
      }
    } catch (erro) {
      console.error("Erro ao conectar com o servidor:", erro);
      toast.error("Erro de conexão.");
    }
  };

  const salvarNotaComunidade = async (idDenuncia) => {
    const textoNota = notasInput[idDenuncia];
    if (!textoNota || textoNota.trim() === "") {
      toast.error("Escreva alguma nota antes de salvar!");
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

        toast.success("Nota sugerida com sucesso!");
        setTimeout(() => window.location.reload(), 1500); // Reload suave só pra notas
      } else {
        toast.error("Erro ao adicionar nota.");
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

        toast.success("Voto computado!");
        setTimeout(() => window.location.reload(), 1500); // Reload suave só pra notas
      } else {
        toast.error("Erro ao validar nota.");
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