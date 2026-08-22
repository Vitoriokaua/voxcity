import { useState, useEffect, useCallback } from "react";

const API_URL = process.env.NODE_ENV === 'production' 
  ? "https://voxcity-backend.onrender.com" 
  : "http://localhost:3001";

export function useRelevantes() {
  const [periodo, setPeriodo] = useState("semana");
  const [denunciasRelevantes, setDenunciasRelevantes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const buscarRelevantes = useCallback(async (periodoSelecionado) => {
    setCarregando(true);
    try {
      const res = await fetch(`${API_URL}/denuncias/relevantes?periodo=${periodoSelecionado}`);
      if (res.ok) {
        const data = await res.json();
        setDenunciasRelevantes(data);
      }
    } catch (error) {
      console.error("Erro ao buscar denúncias relevantes:", error);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    buscarRelevantes(periodo);
  }, [periodo, buscarRelevantes]);

  return {
    periodo,
    setPeriodo,
    denunciasRelevantes,
    setDenunciasRelevantes,
    carregando,
  };
}