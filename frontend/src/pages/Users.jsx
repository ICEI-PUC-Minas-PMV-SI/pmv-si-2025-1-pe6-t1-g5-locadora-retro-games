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
  Select,
  Paper,
  Box,
} from "@mantine/core";
import { AppWrapper } from "../components/AppWrapper";
import { DataTable } from "../components/DataTable";
import axios from "axios";
import { IconEdit, IconEye, IconTrash, IconPlus } from "@tabler/icons-react";
import { maskCpf } from "../utils/maskCpf"; // sua função de máscara
import { toast } from "../utils/Toast";

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
  const [modalType, setModalType] = useState("create"); // "create" | "edit" | "delete" | "view"
  const [selectedUser, setSelectedUser] = useState(null);

  // Form states
  const [form, setForm] = useState({ name: "", email: "", cpf: "", password: "", roleId: "2" });

  // Adicione as opções de role
  const roleOptions = [
    { value: "1", label: "Administrador" },
    { value: "2", label: "Usuário" },
  ];

  const headers = [
    { label: "ID", key: "id" },
    { label: "Nome", key: "name" },
    { label: "Email", key: "email" },
    { label: "CPF", key: "cpf" },
    { label: "Tipo", key: "roleLabel" },
  ];

  // Função para abrir modal de criar/editar
  const openModal = (type, user = null) => {
    setModalType(type);
    setSelectedUser(user);
    setForm(
      user
        ? { name: user.name, email: user.email, cpf: user.cpf, password: "", roleId: String(user.roleId || "2") }
        : { name: "", email: "", cpf: "", password: "", roleId: "2" }
    );
    setModalOpen(true);
  };

  // CRUD actions
  const handleCreateOrEdit = async () => {
    try {
      const cleanForm = { ...form, cpf: form.cpf.replace(/\D/g, ""), roleId: Number(form.roleId) };
      if (modalType === "create") {
        await axios.post("http://localhost:8080/users", cleanForm, {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        });
      } else if (modalType === "edit" && selectedUser) {
        await axios.put(`http://localhost:8080/users/${selectedUser.id}`, cleanForm, {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        });
      }
      setModalOpen(false);
      fetchUsers();
    } catch (e) {
      toast.error("Erro ao salvar usuário.");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/users/${selectedUser.id}`, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      });
      setModalOpen(false);
      fetchUsers();
    } catch (e) {
      toast.error("Erro ao deletar usuário.");
    }
  };

  const actions = [
    {
      icon: <IconEye size={16} />,
      label: "Visualizar",
      onClick: (row) => openModal("view", row),
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
              data={users.map((u) => ({
                ...u,
                cpf: maskCpf(u.cpf),
                roleLabel: u.roleId === 1 ? "Administrador" : "Usuário"
              }))}
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
        {/* Modal de criar/editar/visualizar */}
        <Modal
          opened={modalOpen && ["create", "edit", "view"].includes(modalType)}
          onClose={() => setModalOpen(false)}
          title={modalType === "create" ? "Novo Usuário" : modalType === "edit" ? "Editar Usuário" : "Visualizar Usuário"}
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
              readOnly={modalType === "view"}
            />
            <TextInput
              label="Email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              required
              radius={8}
              readOnly={modalType === "view"}
            />
            <TextInput
              label="CPF"
              value={form.cpf}
              onChange={(e) => setForm((f) => ({ ...f, cpf: e.target.value }))}
              required
              maxLength={14}
              radius={8}
              readOnly={modalType === "view"}
            />
            <PasswordInput
              label="Senha"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              required={modalType === "create"}
              placeholder={modalType === "edit" ? "Deixe em branco para não alterar" : ""}
              radius={8}
              readOnly={modalType === "view"}
            />
            <Select
              label="Tipo de Usuário"
              data={roleOptions}
              value={form.roleId}
              onChange={(value) => setForm((f) => ({ ...f, roleId: value }))}
              required
              radius={8}
              readOnly={modalType === "view"}
              disabled={modalType === "view"}
            />
            {modalType !== "view" && (
              <Group position="right" mt="md">
                <Button onClick={handleCreateOrEdit} style={{ borderRadius: 8 }}>
                  {modalType === "create" ? "Criar" : "Salvar"}
                </Button>
              </Group>
            )}
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