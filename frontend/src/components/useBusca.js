import { useState } from "react";

export function useBusca(denuncias) {
  const [termoBusca, setTermoBusca] = useState("");

  const denunciasFiltradas = denuncias.filter((denuncia) => {
    if (!termoBusca) return true;

    const termo = termoBusca.toLowerCase();
    const descricao = denuncia.descricao ? denuncia.descricao.toLowerCase() : "";
    const endereco = denuncia.endereco ? denuncia.endereco.toLowerCase() : "";

    return descricao.includes(termo) || endereco.includes(termo);
  });

  return { termoBusca, setTermoBusca, denunciasFiltradas };
}