import { useCallback, useEffect, useState } from "react";
import {
  Container,
  Title,
  Loader,
  Button,
  Group,
  Modal,
  Stack,
  Select,
  Box,
  TextInput,
  Badge,
} from "@mantine/core";
import { AppWrapper } from "../components/AppWrapper";
import { DataTable } from "../components/DataTable";
import axios from "axios";
import { IconEdit, IconEye, IconTrash, IconPlus } from "@tabler/icons-react";
import moment from "moment";
import { ListItem, forwardRef } from "react";

export function Orders() {
  const [orders, setOrders] = useState([]);
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
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Form states
  const [form, setForm] = useState({
    id: "",
    userId: "",
    gameId: "",
    statusReserveId: "",
    reserveDate: "",
    approveDate: "",
    returnDate: "",
  });
  const [users, setUsers] = useState([]);
  const [games, setGames] = useState([]);
  const [statuses, setStatuses] = useState([
    { value: "1", label: "Reservado" },
    { value: "2", label: "Devolvido" },
    { value: "3", label: "Cancelado" },
    { value: "4", label: "Pendente" },
  ]);

  const statusColors = {
    "1": "blue",
    "2": "green",
    "3": "red",
    "4": "yellow",
  };

  const headers = [
    { label: "ID", key: "id" },
    { label: "Usuário", key: "userName" },
    { label: "Jogo", key: "gameName" },
    { label: "Status", key: "statusName" },
    { label: "Data Reserva", key: "reserveDate", type: "date" },
    { label: "Aprovação", key: "approveDate", type: "date" },
    { label: "Devolução", key: "returnDate", type: "date" },
  ];

  // Função para abrir modal de criar/editar
  const openModal = (type, order = null) => {
    setModalType(type);
    setSelectedOrder(order);
    setForm(
      order
        ? {
            id: order.id,
            userId: order.userId + "",
            gameId: order.gameId + "",
            statusReserveId: order.statusReserveId + "",
            reserveDate: order.reserveDate ? moment(order.reserveDate).format("YYYY-MM-DDTHH:mm") : "",
            approveDate: order.approveDate ? moment(order.approveDate).format("YYYY-MM-DDTHH:mm") : "",
            returnDate: order.returnDate ? moment(order.returnDate).format("YYYY-MM-DDTHH:mm") : "",
          }
        : {
            id: "",
            userId: "",
            gameId: "",
            statusReserveId: "",
            reserveDate: moment().format("YYYY-MM-DDTHH:mm"),
            approveDate: "",
            returnDate: "",
          }
    );
    setModalOpen(true);
  };

  // CRUD actions
  const handleCreateOrEdit = async () => {
    try {
      const payload = {
        ...form,
        userId: Number(form.userId),
        gameId: Number(form.gameId),
        statusReserveId: Number(form.statusReserveId),
        reserveDate: form.reserveDate ? new Date(form.reserveDate) : null,
        approveDate: form.approveDate ? new Date(form.approveDate) : null,
        returnDate: form.returnDate ? new Date(form.returnDate) : null,
      };
      if (modalType === "create") {
        await axios.post("http://localhost:8080/orders/admin", payload, {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        });
      } else if (modalType === "edit" && selectedOrder) {
        await axios.put("http://localhost:8080/orders/admin", payload, {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        });
      }
      setModalOpen(false);
      fetchOrders();
    } catch (e) {
      alert("Erro ao salvar reserva.");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete("http://localhost:8080/orders/admin", {
        data: {
          id: selectedOrder.id,
          userId: selectedOrder.userId,
          gameId: selectedOrder.gameId,
        },
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      });
      setModalOpen(false);
      fetchOrders();
    } catch (e) {
      alert("Erro ao deletar reserva.");
    }
  };

  // Atualiza status diretamente na tabela
  const handleStatusChange = async (row, newStatusLabel) => {
    try {
      const statusMap = { Reservado: 1, Devolvido: 2, Cancelado: 3, Pendente: 4 };
      const payload = {
        ...row,
        statusReserveId: statusMap[newStatusLabel],
        approveDate: row.approveDate,
        returnDate: row.returnDate,
        reserveDate: row.reserveDate,
      };
      await axios.put("http://localhost:8080/orders/admin", payload, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      });
      fetchOrders();
    } catch (e) {
      alert("Erro ao atualizar status.");
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
        setSelectedOrder(row);
        setModalType("delete");
        setModalOpen(true);
      },
    },
  ];

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8080/orders", {
        params: { page, limit, search, field, order },
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      });
      setOrders(
        (res.data.orders || []).map((o) => ({
          ...o,
          userName: o.user?.name || o.userName || o.userId,
          gameName: o.game?.name || o.gameName || o.gameId,
          statusName: statuses.find((s) => s.value == (o.statusReserveId || o.statusReserveId))?.label || o.statusReserveId,
        }))
      );
      setTotal(res.data.total || 0);
    } catch (e) {
      setOrders([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, field, order, statuses]);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:8080/users", {
        params: { limit: 100, page: 1 },
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      });
      setUsers((res.data.users || []).map((u) => ({ value: u.id + "", label: u.name })));
    } catch (e) {
      setUsers([]);
    }
  }, []);

  const fetchGames = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:8080/games", {
        params: { limit: 100, page: 1 },
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      });
      setGames((res.data.games || []).map((g) => ({ value: g.id + "", label: g.name })));
    } catch (e) {
      setGames([]);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, [page, limit, search, field, order]);

  useEffect(() => {
    fetchUsers();
    fetchGames();
  }, [fetchUsers, fetchGames]);

  return (
    <AppWrapper>
      <Container size="lg" pt="xl">
        <Group position="apart" mb="md">
          <Title order={2} style={{ letterSpacing: 0.5 }}>Reservas</Title>
          <Button leftSection={<IconPlus size={16} />} onClick={() => openModal("create")}
            style={{ borderRadius: 8, fontWeight: 600 }}>
            Nova Reserva
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
              data={orders}
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
              placeholder="Buscar por usuário ou jogo"
              actions={actions}
              onStatusChange={handleStatusChange}
            />
          )}
        </Box>
        {/* Modal de criar/editar */}
        <Modal
          opened={modalOpen && (modalType === "create" || modalType === "edit")}
          onClose={() => setModalOpen(false)}
          title={modalType === "create" ? "Nova Reserva" : "Editar Reserva"}
          centered
          radius={12}
        >
          <Stack>
            <Select
              label="Usuário"
              data={users}
              value={form.userId}
              onChange={(value) => setForm((f) => ({ ...f, userId: value }))}
              required
              radius={8}
              placeholder="Selecione o usuário"
            />
            <Select
              label="Jogo"
              data={games}
              value={form.gameId}
              onChange={(value) => setForm((f) => ({ ...f, gameId: value }))}
              required
              radius={8}
              placeholder="Selecione o jogo"
            />
            <Select
              label="Status"
              data={statuses}
              value={form.statusReserveId}
              onChange={(value) => setForm((f) => ({ ...f, statusReserveId: value }))}
              required
              radius={8}
              placeholder="Selecione o status"
              itemComponent={forwardRef(({ value, label, ...rest }, ref) => (
                <div ref={ref} {...rest} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Badge color={statusColors[value] || "gray"} variant="filled">{label}</Badge>
                </div>
              ))}
              renderValue={(selected) => {
                const status = statuses.find((s) => s.value === selected);
                return (
                  <Badge color={statusColors[selected] || "gray"} variant="filled">
                    {status ? status.label : selected}
                  </Badge>
                );
              }}
            />
            <TextInput
              label="Data da Reserva"
              type="datetime-local"
              value={form.reserveDate}
              onChange={(e) => setForm((f) => ({ ...f, reserveDate: e.target.value }))}
              required
              radius={8}
            />
            <TextInput
              label="Data de Aprovação"
              type="datetime-local"
              value={form.approveDate}
              onChange={(e) => setForm((f) => ({ ...f, approveDate: e.target.value }))}
              radius={8}
            />
            <TextInput
              label="Data de Devolução"
              type="datetime-local"
              value={form.returnDate}
              onChange={(e) => setForm((f) => ({ ...f, returnDate: e.target.value }))}
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
              Tem certeza que deseja excluir a reserva de <b>{selectedOrder?.userName}</b> para o jogo <b>{selectedOrder?.gameName}</b>?
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
