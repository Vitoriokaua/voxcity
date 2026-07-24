import { useState } from "react";

export function useBusca(denuncias) {
  const [termoBusca, setTermoBusca] = useState("");

  const denunciasFiltradas = denuncias.filter((denuncia) => {
  
    if (!termoBusca) return true;

    const termo = termoBusca.toLowerCase();
    const titulo = denuncia.titulo ? denuncia.titulo.toLowerCase() : "";
    const descricao = denuncia.descricao ? denuncia.descricao.toLowerCase() : "";
    const local = denuncia.local ? denuncia.local.toLowerCase() : "";


    return titulo.includes(termo) || descricao.includes(termo) || local.includes(termo);
  });

  return { termoBusca, setTermoBusca, denunciasFiltradas };
}