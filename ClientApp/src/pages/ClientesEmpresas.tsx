import { useEffect, useState } from "react"
import { Button, ButtonGroup, Modal, Form, Table } from "react-bootstrap"
import { useFormik } from "formik"
import * as Yup from "yup"
import Select from "react-select"

import toast from "react-hot-toast"

import { Loading } from "../components/Loading"

import "../styles/empresas.scss"
import { useEmpresas } from "../hooks/useEmpresas"
import { useClientes } from "../hooks/useClientes"

type apiClienteEmpresa = Record<
  string,
  {
    id: number
    clienteID: number
    empresaID: number
  }
>

type ClienteEmpresa = {
  id: number
  clienteId: number
  empresaId: number
}

type SelectOptions = {
  value: number
  label: string
}

export function ClientesEmpresas() {
  const [clientesEmpresas, setClientesEmpresas] = useState<ClienteEmpresa[]>([])
  const [loaded, setLoaded] = useState(false)
  const [editId, setEditId] = useState(0)
  const [addModal, setAddModal] = useState(false)
  const { fetchedEmpresas } = useEmpresas(!addModal)
  const { fetchedClientes } = useClientes(!addModal)

  const clientesOptions: SelectOptions[] = fetchedClientes.map((cliente) => ({
    value: cliente.id,
    label: cliente.nome,
  }))
  const empresasOptions: SelectOptions[] = fetchedEmpresas.map((empresa) => ({
    value: empresa.id,
    label: empresa.razaoSocial,
  }))

  useEffect(() => {
    if (!addModal) {
      loadClientesEmpresas()
    }
    console.log()
  }, [addModal])

  //Consulta realizada diretamente no front-end
  const search = useFormik({
    initialValues: {
      searchCriteria: "",
    },
    onSubmit: () => {},
  })

  const formik = useFormik({
    initialValues: {
      clienteId: { value: "", label: "" },
      empresaId: { value: "", label: "" },
    },
    validationSchema: Yup.object({
      clienteId: Yup.number().required("Campo obrigatório"),
      empresaId: Yup.number().required("Campo obrigatório"),
    }),
    onSubmit: (values) => {
      handleSave(values)
    },
  })

  const handleShowAddModal = () => setAddModal(true)
  const handleCloseAddModal = () => {
    setAddModal(false)
    formik.resetForm()
  }

  async function loadClientesEmpresas() {
    const response = await fetch("api/ClienteEmpresas")
    const apiClientesEmpresas: apiClienteEmpresa = await response.json()
    const parsedClientesEmpresas = Object.entries(apiClientesEmpresas).map(([key, value]) => {
      return {
        id: value.id,
        clienteId: value.clienteID,
        empresaId: value.empresaID,
      }
    })
    setClientesEmpresas(parsedClientesEmpresas)
    setLoaded(true)
  }

  //TODO
  async function handleSave(clienteEmpresa: Object) {
    let requestData
    let response
    let msg

    if (editId > 0) {
      requestData = JSON.stringify({
        ...{ id: +editId },
        ...clienteEmpresa,
      })
      response = await fetch("api/ClienteEmpresas/" + editId, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: requestData,
      })
      msg = "editado"
      setEditId(0)
    } else {
      requestData = JSON.stringify(clienteEmpresa)
      response = await fetch("api/ClienteEmpresas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: requestData,
      })
      msg = "criado"
    }

    handleCloseAddModal()
    await new Promise((f) => setTimeout(f, 100))
    response.ok
      ? toast.success("Empresa " + msg + " com suceso!")
      : toast.error("Erro " + response.status.toString())
  }

  function handleEdit(clienteEmpresa: ClienteEmpresa) {
    setEditId(clienteEmpresa.id)
    formik.setFieldValue("clienteId", clienteEmpresa.clienteId)
    formik.setFieldValue("empresaId", clienteEmpresa.empresaId)
    handleShowAddModal()
  }

  async function handleDelete(clienteEmpresaId: number) {
    await fetch("api/ClienteEmpresas/" + clienteEmpresaId, {
      method: "DELETE",
    })
    setClientesEmpresas(
      clientesEmpresas.filter((data) => {
        return data.id !== clienteEmpresaId
      })
    )
  }

  if (loaded) {
    return (
      <div id="empresasPage" className="flex-grow-1">
        <div className="container-fluid d-flex flex-column py-3">
          <div className="d-flex justify-content-between mb-3">
            <Button variant="success" onClick={handleShowAddModal}>
              Nova Empresa
            </Button>

            <Form.Control
              id="searchCriteria"
              name="searchCriteria"
              type="text"
              onChange={search.handleChange}
              onBlur={search.handleBlur}
              placeholder="Pesquisar por cliente"
              value={search.values.searchCriteria}></Form.Control>
          </div>

          <Table borderless variant="light">
            <thead>
              <tr className="table-dark">
                <th>ID</th>
                <th>Cliente</th>
                <th>Empresa</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {clientesEmpresas
                .filter((clienteEmpresa) =>
                  clienteEmpresa.clienteId.toString().startsWith(search.values.searchCriteria)
                )
                .map((clienteEmpresaFiltro) => (
                  <tr key={clienteEmpresaFiltro.id}>
                    <td>{clienteEmpresaFiltro.id}</td>
                    <td>{clienteEmpresaFiltro.clienteId}</td>
                    <td>{clienteEmpresaFiltro.empresaId}</td>
                    <td>
                      <ButtonGroup>
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleEdit(clienteEmpresaFiltro)}>
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDelete(clienteEmpresaFiltro.id)}>
                          Excluir
                        </Button>
                      </ButtonGroup>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>

          <Modal show={addModal} onHide={handleCloseAddModal}>
            <Modal.Header className="d-flex justify-content-center">
              <h4>Adicionar cliente à empresa</h4>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="clienteId">Cliente</Form.Label>
                  <Select
                    isSearchable
                    isClearable
                    options={clientesOptions}
                    noOptionsMessage={() => "Sem resultados"}
                    placeholder="Selecione um cliente"
                    inputId="clienteId"
                    name="clienteId"
                    onChange={(e) =>
                      e !== null
                        ? formik.setFieldValue("clienteId", e.value)
                        : formik.setFieldValue("clienteId", "")
                    }
                    onBlur={formik.handleBlur}></Select>
                  {formik.touched.clienteId && formik.errors.clienteId && (
                    <div className="fst-italic fw-bold text-danger">{formik.errors.clienteId}</div>
                  )}
                </Form.Group>

                <Form.Group>
                  <Form.Label htmlFor="empresaId">Empresa</Form.Label>
                  <Select
                    isSearchable
                    isClearable
                    options={empresasOptions}
                    noOptionsMessage={() => "Sem resultados"}
                    placeholder="Selecione uma empresa"
                    inputId="empresaId"
                    name="empresaId"
                    onChange={(e) =>
                      e !== null
                        ? formik.setFieldValue("empresaId", e.value)
                        : formik.setFieldValue("empresaId", "")
                    }
                    onBlur={formik.handleBlur}></Select>
                  {formik.touched.empresaId && formik.errors.empresaId && (
                    <div className="fst-italic fw-bold text-danger">{formik.errors.empresaId}</div>
                  )}
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={() => formik.handleSubmit()}>
                Salvar
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    )
  } else {
    return <Loading />
  }
}
