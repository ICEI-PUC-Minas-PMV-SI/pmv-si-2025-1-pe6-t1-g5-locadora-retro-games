import { useCallback, useEffect, useState } from "react";
import {
  Container,
  Title,
  Loader,
  Button,
  Group,
  Modal,
  Stack,
  TextInput,
  PasswordInput,
  Paper,
  Box,
} from "@mantine/core";
import { AppWrapper } from "../components/AppWrapper";
import { DataTable } from "../components/DataTable";
import axios from "axios";
import { IconEdit, IconEye, IconTrash, IconPlus } from "@tabler/icons-react";
import { maskCpf } from "../utils/maskCpf"; // sua função de máscara

export function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [field, setField] = useState("id");
  const [order, setOrder] = useState("asc");

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("create"); // "create" | "edit" | "delete"
  const [selectedUser, setSelectedUser] = useState(null);

  // Form states
  const [form, setForm] = useState({ name: "", email: "", cpf: "", password: "" });

  const headers = [
    { label: "ID", key: "id" },
    { label: "Nome", key: "name" },
    { label: "Email", key: "email" },
    { label: "CPF", key: "cpf" },
  ];

  // Função para abrir modal de criar/editar
  const openModal = (type, user = null) => {
    setModalType(type);
    setSelectedUser(user);
    setForm(
      user
        ? { name: user.name, email: user.email, cpf: user.cpf, password: "" }
        : { name: "", email: "", cpf: "", password: "" }
    );
    setModalOpen(true);
  };

  // CRUD actions
  const handleCreateOrEdit = async () => {
    try {
      if (modalType === "create") {
        await axios.post("http://localhost:8080/users", form);
      } else if (modalType === "edit" && selectedUser) {
        await axios.put(`http://localhost:8080/users/${selectedUser.id}`, form);
      }
      setModalOpen(false);
      fetchUsers();
    } catch (e) {
      alert("Erro ao salvar usuário.");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/users/${selectedUser.id}`);
      setModalOpen(false);
      fetchUsers();
    } catch (e) {
      alert("Erro ao deletar usuário.");
    }
  };

  const actions = [
    {
      icon: <IconEye size={16} />,
      label: "Visualizar",
      onClick: (row) => openModal("edit", row),
    },
    {
      icon: <IconEdit size={16} />,
      label: "Editar",
      onClick: (row) => openModal("edit", row),
    },
    {
      icon: <IconTrash size={16} />,
      label: "Excluir",
      color: "red",
      onClick: (row) => {
        setSelectedUser(row);
        setModalType("delete");
        setModalOpen(true);
      },
    },
  ];

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8080/users", {
        params: { page, limit, search, field, order },
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      });
      setUsers(res.data.users || []);
      setTotal(res.data.total || 0);
    } catch (e) {
      setUsers([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, field, order]);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, [page, limit, search, field, order]);

  return (
    <AppWrapper>
      <Container size="lg" pt="xl">
        <Group position="apart" mb="md">
          <Title order={2} style={{ letterSpacing: 0.5 }}>Usuários</Title>
          <Button leftSection={<IconPlus size={16} />} onClick={() => openModal("create")}
            style={{ borderRadius: 8, fontWeight: 600 }}>
            Novo Usuário
          </Button>
        </Group>
        <Box
          bg="#fff"
          p="lg"
          style={{
            borderRadius: 16,
            boxShadow: "0 4px 24px 0 rgba(34, 34, 87, 0.08)",
            border: "1px solid #f0f0f0",
            marginTop: 16,
            marginBottom: 16,
          }}
        >
          {loading ? (
            <Loader />
          ) : (
            <DataTable
              headers={headers}
              data={users.map((u) => ({ ...u, cpf: maskCpf(u.cpf) }))}
              total={total}
              limit={limit}
              page={page}
              setPage={setPage}
              setLimit={setLimit}
              setSearch={setSearch}
              setField={setField}
              setOrder={setOrder}
              field={field}
              order={order}
              placeholder="Buscar por nome ou email"
              actions={actions}
            />
          )}
        </Box>
        {/* Modal de criar/editar */}
        <Modal
          opened={modalOpen && (modalType === "create" || modalType === "edit")}
          onClose={() => setModalOpen(false)}
          title={modalType === "create" ? "Novo Usuário" : "Editar Usuário"}
          centered
          radius={12}
        >
          <Stack>
            <TextInput
              label="Nome"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
              radius={8}
            />
            <TextInput
              label="Email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              required
              radius={8}
            />
            <TextInput
              label="CPF"
              value={form.cpf}
              onChange={(e) => setForm((f) => ({ ...f, cpf: e.target.value }))}
              required
              maxLength={14}
              radius={8}
            />
            <PasswordInput
              label="Senha"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              required={modalType === "create"}
              placeholder={modalType === "edit" ? "Deixe em branco para não alterar" : ""}
              radius={8}
            />
            <Group position="right" mt="md">
              <Button onClick={handleCreateOrEdit} style={{ borderRadius: 8 }}>
                {modalType === "create" ? "Criar" : "Salvar"}
              </Button>
            </Group>
          </Stack>
        </Modal>
        {/* Modal de confirmação de exclusão */}
        <Modal
          opened={modalOpen && modalType === "delete"}
          onClose={() => setModalOpen(false)}
          title="Confirmar exclusão"
          centered
          radius={12}
        >
          <Stack>
            <div>
              Tem certeza que deseja excluir o usuário {" "}
              <b>{selectedUser?.name}</b>?
            </div>
            <Group position="right" mt="md">
              <Button variant="outline" onClick={() => setModalOpen(false)} style={{ borderRadius: 8 }}>
                Cancelar
              </Button>
              <Button color="red" onClick={handleDelete} style={{ borderRadius: 8 }}>
                Excluir
              </Button>
            </Group>
          </Stack>
        </Modal>
      </Container>
    </AppWrapper>
  );
}