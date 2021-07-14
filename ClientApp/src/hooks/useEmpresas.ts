import { useEffect, useState } from "react"

type apiEmpresa = Record<
  string,
  {
    id: number
    cnpj: string
    razaoSocial: string
  }
>

type Empresa = {
  id: number
  cnpj: string
  razaoSocial: string
}

export function useEmpresas(addModal: boolean) {
  const [fetchedEmpresas, setEmpresas] = useState<Empresa[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!addModal) {
      loadEmpresas()
    }
  }, [addModal])

  async function loadEmpresas() {
    const response = await fetch("api/Empresas")
    const apiEmpresas: apiEmpresa = await response.json()
    const parsedEmpresas = Object.entries(apiEmpresas).map(([key, value]) => {
      return {
        id: value.id,
        cnpj: value.cnpj,
        razaoSocial: value.razaoSocial,
      }
    })
    setEmpresas(parsedEmpresas)
    setLoaded(true)
  }

  return { fetchedEmpresas, loaded }
}
