import React, { useState } from "react";
import { FormEtapaTexto } from "./FormEtapaTexto";
import { FormEtapaMapa } from "./FormEtapaMapa";
import toast from "react-hot-toast";

export function FormularioDenuncia() {
  const [descricao, setDescricao] = useState("");
  const [foto, setFoto] = useState(null);
  const [posicao, setPosicao] = useState(null);
  const [endereco, setEndereco] = useState("");
  const [anonimo, setAnonimo] = useState(false);
  const [etapa, setEtapa] = useState(1);

  const enviarDenuncia = async () => {
    if (!posicao) {
      toast.error(
        "Por favor, clique no mapa para selecionar o local da ocorrência!",
      );
      return;
    }

    const formData = new FormData();
    formData.append("descricao", descricao);
    formData.append("latitude", posicao.lat);
    formData.append("longitude", posicao.lng);
    formData.append("endereco", endereco);
    formData.append("anonimo", anonimo.toString());

    if (foto) {
      formData.append("foto", foto);
    }

    const token = localStorage.getItem("token");

try {
      // Cria a variável que decide se usa Nuvem ou Localhost
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

      const resposta = await fetch(`${API_URL}/denuncias`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (resposta.ok) {
        toast.success("Denúncia enviada com sucesso!");
        setDescricao("");
        setFoto(null);
        setPosicao(null);
        setEndereco("");
        setAnonimo(false);
        setEtapa(1);
      } else {
        const textoErro = await resposta.text();
        try {
          const jsonErro = JSON.parse(textoErro);
          console.log(
            `Erro do Servidor (${resposta.status}): ${jsonErro.erro || "Erro interno"}`,
          );
        } catch {
          console.log(
            `Erro do Servidor (${resposta.status}): ${textoErro || "Erro desconhecido"}`,
          );
        }
      }
    } catch (erro) {
      console.error("Erro ao conectar com o servidor:", erro);
      alert("Não foi possível conectar ao servidor.");
    }
  };

  return (
    <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl z-10">
      {etapa === 1 ? (
        <FormEtapaTexto
          descricao={descricao}
          setDescricao={setDescricao}
          foto={foto}
          setFoto={setFoto}
          anonimo={anonimo}
          setAnonimo={setAnonimo}
          onAvancar={() => setEtapa(2)}
        />
      ) : (
        <FormEtapaMapa
          posicao={posicao}
          setPosicao={setPosicao}
          setEndereco={setEndereco}
          onVoltar={() => setEtapa(1)}
          onEnviar={enviarDenuncia}
        />
      )}
    </div>
  );
}
