import { useEffect, useState } from "react"

type apiCliente = Record<
  string,
  {
    id: number
    cpf: string
    nome: string
    email: string
    dtCriacao: Date
  }
>

type Cliente = {
  id: number
  cpf: string
  nome: string
  email: string
  dtCriacao: Date
}

export function useClientes(addModal: boolean, searchCriteria: string = "") {
  const [fetchedClientes, setClientes] = useState<Cliente[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!addModal) {
      loadClientes()
    }
  }, [addModal])

  useEffect(() => {
    if (searchCriteria === "") {
      loadClientes()
    }
  }, [searchCriteria])

  async function loadClientes() {
    const response = await fetch("api/Clientes")
    const apiClientes: apiCliente = await response.json()
    const parsedClientes = Object.entries(apiClientes).map(([key, value]) => {
      return {
        id: value.id,
        cpf: value.cpf,
        nome: value.nome,
        email: value.email,
        dtCriacao: value.dtCriacao,
      }
    })
    setClientes(parsedClientes)
    setLoaded(true)
  }

  return { fetchedClientes, loaded }
}
