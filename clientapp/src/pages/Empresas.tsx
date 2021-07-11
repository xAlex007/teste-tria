import { useEffect, useState } from "react"
import { Button, ButtonGroup, Modal, Form, Table } from "react-bootstrap"
import { useFormik } from "formik"
import * as Yup from "yup"
import toast, { Toaster } from "react-hot-toast"

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

export function Empresas() {
  const [loaded, setLoaded] = useState(false)
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [editId, setEditId] = useState(0)
  const [addModal, setAddModal] = useState(false)

  const handleShowAddModal = () => setAddModal(true)
  const handleCloseAddModal = () => {
    setAddModal(false)
    formik.resetForm()
  }

  const formik = useFormik({
    initialValues: {
      cnpj: "",
      razaoSocial: "",
    },
    validationSchema: Yup.object({
      cnpj: Yup.string().length(14, "Formato inválido").required("Campo obrigatório"),
      razaoSocial: Yup.string()
        .min(4, "Nome muito curto")
        .max(150, "Nome muito longo")
        .required("Campo obrigatório"),
    }),
    onSubmit: (values) => {
      handleSave(values)
    },
  })

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

  async function handleSave(values: Object) {
    let requestData
    let response
    let msg

    if (editId > 0) {
      requestData = JSON.stringify({
        ...{ id: +editId },
        ...values,
      })
      response = await fetch("api/Empresas/" + editId, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: requestData,
      })
      msg = "editada"
      setEditId(0)
    } else {
      requestData = JSON.stringify(values)
      response = await fetch("api/Empresas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: requestData,
      })
      msg = "criada"
    }

    handleCloseAddModal()
    await new Promise((f) => setTimeout(f, 100))
    response.ok
      ? toast.success("Empresa " + msg + " com suceso!")
      : toast.error("Erro " + response.status.toString())
  }

  function handleEdit(empresa: Empresa) {
    setEditId(empresa.id)
    formik.setFieldValue("cnpj", empresa.cnpj)
    formik.setFieldValue("razaoSocial", empresa.razaoSocial)
    handleShowAddModal()
  }

  async function handleDelete(empresaId: number) {
    await fetch("api/Empresas/" + empresaId, {
      method: "DELETE",
    })
    setEmpresas(
      empresas.filter((data) => {
        return data.id !== empresaId
      })
    )
  }

  if (loaded) {
    return (
      <div id="empresasPage" className="flex-grow-1">
        <div className="container-fluid d-flex" style={{ width: "100%" }}>
          <Toaster />

          <div className="flex-grow-1">
            <Button variant="outline-success" onClick={handleShowAddModal}>
              Nova Empresa
            </Button>

            <Table variant="light" bordered>
              <thead>
                <tr className="table-dark">
                  <th>ID</th>
                  <th>CNPJ</th>
                  <th>Razão Social</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {empresas.map((empresa) => (
                  <tr key={empresa.id}>
                    <td>{empresa.id}</td>
                    <td>{empresa.cnpj}</td>
                    <td>{empresa.razaoSocial}</td>
                    <td>
                      <ButtonGroup>
                        <Button size="sm" variant="primary" onClick={() => handleEdit(empresa)}>
                          Editar
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => handleDelete(empresa.id)}>
                          Excluir
                        </Button>
                      </ButtonGroup>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          <Modal show={addModal} onHide={handleCloseAddModal}>
            <Modal.Header className="d-flex justify-content-center">
              <h4>Nova Empresa</h4>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="cnpj">CNPJ</Form.Label>
                  <Form.Control
                    id="cnpj"
                    name="cnpj"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.cnpj}></Form.Control>
                  {formik.touched.cnpj && formik.errors.cnpj && <div>{formik.errors.cnpj}</div>}
                </Form.Group>

                <Form.Group>
                  <Form.Label htmlFor="razaoSocial">Razão Social</Form.Label>
                  <Form.Control
                    id="razaoSocial"
                    name="razaoSocial"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.razaoSocial}></Form.Control>
                  {formik.touched.razaoSocial && formik.errors.razaoSocial && (
                    <div>{formik.errors.razaoSocial}</div>
                  )}
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={formik.handleReset}>
                Limpar
              </Button>
              <Button variant="primary" onClick={() => formik.handleSubmit()}>
                Salvar
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    )
  } else {
    return <h1>Carregando...</h1>
  }
}
