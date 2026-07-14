import { useState } from "react";
import toast from "react-hot-toast";

export function useFeed() {
  const usuarioLogado = JSON.parse(localStorage.getItem("usuario") || "{}");
  const ehModerador = usuarioLogado.role === "MODERADOR";

  const [notasInput, setNotasInput] = useState({});
  const [likes, setLikes] = useState({});
  const [acoesMod, setAcoesMod] = useState(() =>
    JSON.parse(localStorage.getItem("acoesMod") || "{}"),
  );

  const toggleLike = (idDenuncia) => {
    setLikes((prev) => ({ ...prev, [idDenuncia]: !prev[idDenuncia] }));
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
        `http://localhost:3001/denuncias/${idDenuncia}/nota`,
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
        window.location.reload();
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
        `http://localhost:3001/denuncias/${idDenuncia}/nota/validar`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (resposta.ok) {
        const novasAcoes = { ...acoesMod, [idDenuncia]: "VOTOU" };
        setAcoesMod(novasAcoes);
        localStorage.setItem("acoesMod", JSON.stringify(novasAcoes));

        toast.success("Voto computado!");
        window.location.reload();
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
    likes,
    toggleLike,
    acoesMod,
    salvarNotaComunidade,
    validarNota,
  };
}
