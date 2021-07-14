import { useEffect, useState } from "react";
import { Button, ButtonGroup, Modal, Form, Table } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";

import { useEmpresas } from "../hooks/useEmpresas";

import { Loading } from "../components/Loading";

type Empresa = {
  id: number;
  cnpj: string;
  razaoSocial: string;
};

export function Empresas() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [editId, setEditId] = useState(0);
  const [addModal, setAddModal] = useState(false);
  const { fetchedEmpresas, loaded } = useEmpresas(addModal);

  useEffect(() => {
    setEmpresas(fetchedEmpresas);
  }, [fetchedEmpresas]);

  //Consulta realizada diretamente no front-end
  const search = useFormik({
    initialValues: {
      searchCriteria: "",
    },
    onSubmit: () => {},
  });

  const formik = useFormik({
    initialValues: {
      cnpj: "",
      razaoSocial: "",
    },
    validationSchema: Yup.object({
      cnpj: Yup.string()
        .length(14, "Formato inválido")
        .required("Campo obrigatório"),
      razaoSocial: Yup.string()
        .min(4, "Nome muito curto")
        .max(150, "Nome muito longo")
        .required("Campo obrigatório"),
    }),
    onSubmit: (values) => {
      handleSave(values);
    },
  });

  const handleShowAddModal = () => setAddModal(true);
  const handleCloseAddModal = () => {
    setAddModal(false);
    formik.resetForm();
  };

  async function handleSave(empresa: Object) {
    let requestData;
    let response;
    let msg;

    if (editId > 0) {
      requestData = JSON.stringify({
        ...{ id: +editId },
        ...empresa,
      });
      response = await fetch("api/Empresas/" + editId, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: requestData,
      });
      msg = "editada";
      setEditId(0);
    } else {
      requestData = JSON.stringify(empresa);
      console.log(requestData);
      response = await fetch("api/Empresas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: requestData,
      });
      msg = "criada";
    }

    handleCloseAddModal();
    await new Promise((f) => setTimeout(f, 100));
    response.ok
      ? toast.success("Empresa " + msg + " com suceso!")
      : toast.error("Erro " + response.status.toString());
  }

  function handleEdit(empresa: Empresa) {
    setEditId(empresa.id);
    formik.setFieldValue("cnpj", empresa.cnpj);
    formik.setFieldValue("razaoSocial", empresa.razaoSocial);
    handleShowAddModal();
  }

  async function handleDelete(empresaId: number) {
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
      <div id="page" className="flex-grow-1">
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
              placeholder="Pesquisar"
              value={search.values.searchCriteria}
            ></Form.Control>
          </div>

          <Table borderless variant="light">
            <thead>
              <tr className="table-dark">
                <th>ID</th>
                <th>CNPJ</th>
                <th>Razão Social</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {empresas
                .filter((empresa) =>
                  empresa.cnpj.startsWith(search.values.searchCriteria)
                )
                .map((empresaFiltro) => (
                  <tr key={empresaFiltro.id}>
                    <td>{empresaFiltro.id}</td>
                    <td>{empresaFiltro.cnpj}</td>
                    <td>{empresaFiltro.razaoSocial}</td>
                    <td>
                      <ButtonGroup>
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleEdit(empresaFiltro)}
                        >
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDelete(empresaFiltro.id)}
                        >
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
                    value={formik.values.cnpj}
                  ></Form.Control>
                  {formik.touched.cnpj && formik.errors.cnpj && (
                    <div className="fst-italic fw-bold text-danger">
                      {formik.errors.cnpj}
                    </div>
                  )}
                </Form.Group>

                <Form.Group>
                  <Form.Label htmlFor="razaoSocial">Razão Social</Form.Label>
                  <Form.Control
                    id="razaoSocial"
                    name="razaoSocial"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.razaoSocial}
                  ></Form.Control>
                  {formik.touched.razaoSocial && formik.errors.razaoSocial && (
                    <div className="fst-italic fw-bold text-danger">
                      {formik.errors.razaoSocial}
                    </div>
                  )}
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={formik.handleReset}>
                Limpar
              </Button>
              <Button variant="primary" onClick={() => formik.handleSubmit()}>
                Salvar
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    );
  } else {
    return <Loading />;
  }
}
