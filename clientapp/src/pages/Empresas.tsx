import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

type apiEmpresas = Record<
  string,
  {
    id: number;
    cnpj: string;
    razaoSocial: string;
  }
>;

type Empresa = {
  id: number;
  cnpj: string;
  razaoSocial: string;
};

export function Empresas() {
  const history = useHistory();
  const [loaded, setLoaded] = useState(false);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);

  useEffect(() => {
    loadEmpresas();
  }, []);

  async function loadEmpresas() {
    const response = await fetch("api/Empresas");
    const apiEmpresas: apiEmpresas = await response.json();
    const parsedEmpresas = Object.entries(apiEmpresas).map(([key, value]) => {
      return {
        id: value.id,
        cnpj: value.cnpj,
        razaoSocial: value.razaoSocial,
      };
    });
    console.log(parsedEmpresas);
    setEmpresas(parsedEmpresas);
    setLoaded(true);
  }

  async function handleEdit(empresaId: number | undefined) {
    history.push("/Empresas/Edit/" + empresaId);
  }

  async function handleDelete(empresaId: number | undefined) {
    await fetch("api/Empresas/" + empresaId, {
      method: "DELETE",
    });
    setEmpresas(
      empresas.filter((data) => {
        return data.id !== empresaId;
      })
    );
  }

  if (loaded) {
    return (
      <table className="table">
        <thead>
          <tr>
            <th></th>
            <th>ID</th>
            <th>CNPJ</th>
            <th>Razão Social</th>
          </tr>
        </thead>
        <tbody>
          {empresas.map((data) => (
            <tr key={data.id}>
              <td></td>
              <td>{data.id}</td>
              <td>{data.cnpj}</td>
              <td>{data.razaoSocial}</td>
              <td>
                <a className="action" onClick={(id) => handleEdit(data.id)}>
                  Editar
                </a>
                <a className="action" onClick={(id) => handleDelete(data.id)}>
                  Deletar
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  } else {
    return <h1>Carregando...</h1>;
  }
}
