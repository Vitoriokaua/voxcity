import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";

const API_URL = process.env.NODE_ENV === 'production' 
  ? "https://voxcity-backend.onrender.com" 
  : "http://localhost:3001";

export function useAdmin() {
  const [denuncias, setDenuncias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [enviandoId, setEnviandoId] = useState(null);

  const buscarDenuncias = useCallback(async () => {
    setCarregando(true);
    try {
      const res = await fetch(`${API_URL}/denuncias`);
      if (res.ok) {
        const data = await res.json();
        setDenuncias(data);
      }
    } catch (error) {
      toast.error("Erro ao carregar denúncias.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    buscarDenuncias();
  }, [buscarDenuncias]);

  const atualizarStatus = async (id, novoStatus) => {
    const token = localStorage.getItem("token");
    setEnviandoId(id);

    try {
      const res = await fetch(`${API_URL}/denuncias/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: novoStatus }),
      });

      if (res.ok) {
        const denunciaAtualizada = await res.json();
        setDenuncias((prev) =>
          prev.map((d) => (d.id === id ? { ...d, status: denunciaAtualizada.status } : d))
        );
        toast.success("Status atualizado!");
      } else {
        const erro = await res.json();
        toast.error(erro.erro || "Erro ao atualizar status.");
      }
    } catch (error) {
      toast.error("Erro de conexão.");
    } finally {
      setEnviandoId(null);
    }
  };

  const concluirDenuncia = async (id, fotoDepoisFile) => {
    const token = localStorage.getItem("token");

    if (!fotoDepoisFile) {
      toast.error("Selecione a foto do 'depois' antes de concluir.");
      return;
    }

    const formData = new FormData();
    formData.append("fotoDepois", fotoDepoisFile);
    setEnviandoId(id);

    try {
      const res = await fetch(`${API_URL}/denuncias/${id}/concluir`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        const denunciaAtualizada = await res.json();
        setDenuncias((prev) =>
          prev.map((d) =>
            d.id === id
              ? { ...d, status: denunciaAtualizada.status, fotoDepois: denunciaAtualizada.fotoDepois }
              : d
          )
        );
        toast.success("Denúncia concluída com sucesso!");
      } else {
        const erro = await res.json();
        toast.error(erro.erro || "Erro ao concluir denúncia.");
      }
    } catch (error) {
      toast.error("Erro de conexão.");
    } finally {
      setEnviandoId(null);
    }
  };

  return {
    denuncias,
    carregando,
    enviandoId,
    atualizarStatus,
    concluirDenuncia,
  };
}