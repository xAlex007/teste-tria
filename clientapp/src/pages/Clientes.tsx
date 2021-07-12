import { useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  Modal,
  Form,
  Table,
  InputGroup,
  Dropdown,
} from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";

import { Loading } from "../components/Loading";

import "../styles/empresas.scss";

type apiCliente = Record<
  string,
  {
    id: number;
    cpf: string;
    nome: string;
    email: string;
    dtCriacao: Date;
  }
>;

type Cliente = {
  id: number;
  cpf: string;
  nome: string;
  email: string;
  dtCriacao: Date;
};

type SearchObj = {
  searchBy: string;
  searchCriteria: string;
};

export function Clientes() {
  const [loaded, setLoaded] = useState(false);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [editId, setEditId] = useState(0);
  const [addModal, setAddModal] = useState(false);

  useEffect(() => {
    if (!addModal) {
      loadClientes();
    }
  }, [addModal]);

  const search = useFormik({
    initialValues: {
      searchBy: "Nome",
      searchCriteria: "",
    },
    onSubmit: (values: SearchObj) => {
      handleSearch(values);
    },
  });

  useEffect(() => {
    if (search.values.searchCriteria === "") {
      loadClientes();
    }
  }, [search.values.searchCriteria]);

  const formik = useFormik({
    initialValues: {
      cpf: "",
      nome: "",
      email: "",
    },
    validationSchema: Yup.object({
      cpf: Yup.string()
        .length(11, "Formato inválido")
        .required("Campo obrigatório"),
      nome: Yup.string()
        .min(4, "Nome muito curto")
        .max(200, "Nome muito longo")
        .required("Campo obrigatório"),
      email: Yup.string()
        .email("E-mail inválido")
        .max(150, "E-mail muito longo"),
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

  async function loadClientes() {
    const response = await fetch("api/Clientes");
    const apiClientes: apiCliente = await response.json();
    const parsedClientes = Object.entries(apiClientes).map(([key, value]) => {
      return {
        id: value.id,
        cpf: value.cpf,
        nome: value.nome,
        email: value.email,
        dtCriacao: value.dtCriacao,
      };
    });
    setClientes(parsedClientes);
    setLoaded(true);
  }

  async function handleSearch(pesquisa: SearchObj) {
    const response = await fetch(
      "api/Clientes/Search/" + pesquisa.searchBy + "/" + pesquisa.searchCriteria
    );
    const apiClientes: apiCliente = await response.json();
    const parsedClientes = Object.entries(apiClientes).map(([key, value]) => {
      return {
        id: value.id,
        cpf: value.cpf,
        nome: value.nome,
        email: value.email,
        dtCriacao: value.dtCriacao,
      };
    });
    setClientes(parsedClientes);
  }

  async function handleSave(cliente: Object) {
    let requestData;
    let response;
    let msg;

    if (editId > 0) {
      requestData = JSON.stringify({
        ...{ id: +editId },
        ...cliente,
        ...{
          dtCriacao: clientes
            .filter((clientes) => clientes.id === editId)
            .map((filtrado) => filtrado.dtCriacao)[0],
        },
      });
      response = await fetch("api/Clientes/" + editId, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: requestData,
      });
      msg = "editado";
      setEditId(0);
    } else {
      requestData = JSON.stringify(cliente);
      response = await fetch("api/Clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: requestData,
      });
      msg = "criado";
    }

    handleCloseAddModal();
    await new Promise((f) => setTimeout(f, 100));
    response.ok
      ? toast.success("Cliente " + msg + " com suceso!")
      : toast.error("Erro " + response.status.toString());
  }

  function handleEdit(cliente: Cliente) {
    setEditId(cliente.id);
    formik.setFieldValue("cpf", cliente.cpf);
    formik.setFieldValue("nome", cliente.nome);
    formik.setFieldValue("email", cliente.email);
    handleShowAddModal();
  }

  async function handleDelete(clienteId: number) {
    await fetch("api/Clientes/" + clienteId, {
      method: "DELETE",
    });
    setClientes(
      clientes.filter((data) => {
        return data.id !== clienteId;
      })
    );
  }

  if (loaded) {
    return (
      <div id="empresasPage" className="flex-grow-1">
        <div className="container-fluid d-flex flex-column py-3">
          <div className="d-flex justify-content-between mb-3">
            <Button variant="success" onClick={handleShowAddModal}>
              Novo Cliente
            </Button>

            <InputGroup id="searchGroup">
              {/*@ts-ignore*/}
              <Dropdown className="d-inline mx-2" autoClose="outside">
                <Dropdown.Toggle id="dropdown-autoclose-outside"></Dropdown.Toggle>

                <Dropdown.Menu>
                  <Form.Check
                    name="searchBy"
                    type="radio"
                    label="Nome"
                    value="Nome"
                    checked={search.values.searchBy === "Nome"}
                    onChange={search.handleChange}
                  ></Form.Check>
                  <Form.Check
                    name="searchBy"
                    type="radio"
                    label="CPF"
                    value="CPF"
                    checked={search.values.searchBy === "CPF"}
                    onChange={search.handleChange}
                  ></Form.Check>
                </Dropdown.Menu>
              </Dropdown>
              <Form.Control
                id="searchCriteria"
                name="searchCriteria"
                type="text"
                onChange={search.handleChange}
                onBlur={search.handleBlur}
                placeholder={"Pesquisar por " + search.values.searchBy}
                value={search.values.searchCriteria}
              ></Form.Control>
              <Button
                type="submit"
                variant="outline-primary"
                onClick={() => search.handleSubmit()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-search"
                  viewBox="0 0 16 16"
                >
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                </svg>
              </Button>
            </InputGroup>
          </div>

          <Table borderless variant="light">
            <thead>
              <tr className="table-dark">
                <th>ID</th>
                <th>CPF</th>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Data de Criação</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <tr key={cliente.id}>
                  <td>{cliente.id}</td>
                  <td>{cliente.cpf}</td>
                  <td>{cliente.nome}</td>
                  <td>{cliente.email}</td>
                  <td>{new Date(cliente.dtCriacao).toLocaleDateString()}</td>
                  <td>
                    <ButtonGroup>
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleEdit(cliente)}
                      >
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(cliente.id)}
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
              <h4>Novo Cliente</h4>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="cpf">CPF</Form.Label>
                  <Form.Control
                    id="cpf"
                    name="cpf"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.cpf}
                  ></Form.Control>
                  {formik.touched.cpf && formik.errors.cpf && (
                    <div className="fst-italic fw-bold text-danger">
                      {formik.errors.cpf}
                    </div>
                  )}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label htmlFor="nome">Nome</Form.Label>
                  <Form.Control
                    id="nome"
                    name="nome"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.nome}
                  ></Form.Control>
                  {formik.touched.nome && formik.errors.nome && (
                    <div className="fst-italic fw-bold text-danger">
                      {formik.errors.nome}
                    </div>
                  )}
                </Form.Group>

                <Form.Group>
                  <Form.Label htmlFor="email">E-mail</Form.Label>
                  <Form.Control
                    id="email"
                    name="email"
                    type="email"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                  ></Form.Control>
                  {formik.touched.email && formik.errors.email && (
                    <div className="fst-italic fw-bold text-danger">
                      {formik.errors.email}
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
