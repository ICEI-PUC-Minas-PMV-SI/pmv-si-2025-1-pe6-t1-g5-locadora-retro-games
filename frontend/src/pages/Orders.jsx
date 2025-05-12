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
  Card,
  SimpleGrid,
  Text,
} from "@mantine/core";
import { AppWrapper } from "../components/AppWrapper";
import { DataTable } from "../components/DataTable";
import api from "../http/api";
import {
  IconEdit,
  IconEye,
  IconTrash,
  IconPlus,
  IconCalendar,
  IconClock,
  IconAlertTriangle,
} from "@tabler/icons-react";
import moment from "moment";
import { ListItem, forwardRef } from "react";
import { toast } from "../utils/Toast";

export function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [field, setField] = useState("id");
  const [order, setOrder] = useState("asc");

  // modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("create"); // "create" | "edit" | "delete" | "view"
  const [selectedOrder, setSelectedOrder] = useState(null);

  // form states
  const [form, setForm] = useState({
    id: "",
    userId: "",
    gameId: "",
    statusReserveId: 4,
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
    1: "blue",
    2: "green",
    3: "red",
    4: "yellow",
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

  // função para abrir modal de criar/editar
  const openModal = (type, order = null) => {
    setModalType(type);
    setSelectedOrder(order);
    setForm(
      order
        ? {
            id: order.id,
            userId: order.userId + "",
            gameId: order.gameId + "",
            statusReserveId: 4,
            reserveDate: order.reserveDate
              ? moment(order.reserveDate).format("YYYY-MM-DDTHH:mm")
              : "",
            approveDate: order.approveDate
              ? moment(order.approveDate).format("YYYY-MM-DDTHH:mm")
              : "",
            returnDate: order.returnDate
              ? moment(order.returnDate).format("YYYY-MM-DDTHH:mm")
              : "",
          }
        : {
            id: "",
            userId: "",
            gameId: "",
            statusReserveId: 4,
            reserveDate: moment().format("YYYY-MM-DDTHH:mm"),
            approveDate: "",
            returnDate: "",
          }
    );
    setModalOpen(true);
  };

  // crud actions
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
        await api.post("/orders/admin", payload);
      } else if (modalType === "edit" && selectedOrder) {
        await api.put("/orders/admin", payload);
      }
      setModalOpen(false);
      fetchOrders();
    } catch (e) {
      toast.error("Erro ao salvar reserva.");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete("/orders/admin", {
        data: {
          id: selectedOrder.id,
          userId: selectedOrder.userId,
          gameId: selectedOrder.gameId,
        },
      });
      setModalOpen(false);
      fetchOrders();
    } catch (e) {
      toast.error("Erro ao deletar reserva.");
    }
  };

  // atualiza status diretamente na tabela
  const handleStatusChange = async (row, newStatusLabel) => {
    try {
      const statusMap = {
        Reservado: 1,
        Devolvido: 2,
        Cancelado: 3,
        Pendente: 4,
      };
      const payload = {
        ...row,
        statusReserveId: statusMap[newStatusLabel],
        approveDate: row.approveDate,
        returnDate: row.returnDate,
        reserveDate: row.reserveDate,
      };
      await api.put("/orders/admin", payload);
      fetchOrders();
    } catch (e) {
      toast.error("Erro ao atualizar status.");
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
        setSelectedOrder(row);
        setModalType("delete");
        setModalOpen(true);
      },
    },
  ];

  const fetchOrders = useCallback(async () => {
    try {
      //setLoading(true);
      const res = await api.get("/orders", {
        params: { page, limit, search, field, order },
      });
      setOrders(
        (res.data.orders || []).map((o) => ({
          ...o,
          userName: fetchUserName(o.userId),
          gameName: fetchGameName(o.gameId),
          statusName:
            statuses.find(
              (s) => s.value == (o.statusReserveId || o.statusReserveId)
            )?.label || o.statusReserveId,
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

  const fetchUserName = async (userId) => {
    try {
      const res = await api.get(`/users/${userId}`)

      return res.data.name;
    } catch(e) {
      return userId;
    }
  };

  const fetchGameName = async (gameId) => {
    try {
      const res = await api.get("/games");
      const game = res.data.games.find(item => item.id == gameId);

      return game.name;
    } catch(e) {
      return gameId;
    }
  }

  const fetchUsers = useCallback(async () => {
    try {
      const res = await api.get("/users", {
        params: { limit: 100, page: 1 },
      });
      setUsers(
        (res.data.users || []).map((u) => ({ value: u.id + "", label: u.name }))
      );
    } catch (e) {
      setUsers([]);
    }
  }, []);

  const fetchGames = useCallback(async () => {
    try {
      const res = await api.get("/games", {
        params: { limit: 100, page: 1 },
      });
      setGames(
        (res.data.games || []).map((g) => ({ value: g.id + "", label: g.name }))
      );
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

  // cards de resumo para reservas
  const totalReservas = orders.length;
  const pendentes = orders.filter((o) => o.statusReserveId === 4).length;
  const atrasadas = orders.filter(
    (o) =>
      o.statusReserveId === 4 &&
      o.returnDate &&
      new Date(o.returnDate) < new Date()
  ).length;

  return (
    <AppWrapper>
      <Container size="xl" pt="xl">
        <Title order={2} mb="md" style={{ color: "#111" }}>
          Reservas
        </Title>
        <Text size="lg" weight={600} mb="xs" style={{ color: "#111" }}>
          Resumo das Reservas
        </Text>
        <SimpleGrid
          cols={3}
          spacing="lg"
          mb="xl"
          breakpoints={[{ maxWidth: 900, cols: 1 }]}
        >
          <Card
            shadow="sm"
            p="lg"
            radius="md"
            style={{ display: "flex", alignItems: "center", gap: 16 }}
          >
            <div
              style={{
                background: "#e3f2fd",
                borderRadius: 12,
                padding: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconCalendar size={32} color="#1976d2" />
            </div>
            <div>
              <Text size="sm" color="dimmed">
                Total de Reservas
              </Text>
              <Text size="xl" weight={700}>
                {totalReservas}
              </Text>
            </div>
          </Card>
          <Card
            shadow="sm"
            p="lg"
            radius="md"
            style={{ display: "flex", alignItems: "center", gap: 16 }}
          >
            <div
              style={{
                background: "#fffde7",
                borderRadius: 12,
                padding: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconClock size={32} color="#ffb300" />
            </div>
            <div>
              <Text size="sm" color="dimmed">
                Reservas Pendentes
              </Text>
              <Text size="xl" weight={700}>
                {pendentes}
              </Text>
            </div>
          </Card>
          <Card
            shadow="sm"
            p="lg"
            radius="md"
            style={{ display: "flex", alignItems: "center", gap: 16 }}
          >
            <div
              style={{
                background: "#ffebee",
                borderRadius: 12,
                padding: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconAlertTriangle size={32} color="#e53935" />
            </div>
            <div>
              <Text size="sm" color="dimmed">
                Reservas Atrasadas
              </Text>
              <Text size="xl" weight={700}>
                {atrasadas}
              </Text>
            </div>
          </Card>
        </SimpleGrid>
        <Text size="lg" weight={600} mb="xs" style={{ color: "#111" }}>
          Lista de Reservas
        </Text>
        <Group position="apart" mb="md">
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => openModal("create")}
            style={{ borderRadius: 8, fontWeight: 600 }}
          >
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
              fetchData={fetchOrders}
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
          opened={modalOpen && ["create", "edit", "view"].includes(modalType)}
          onClose={() => setModalOpen(false)}
          title={
            modalType === "create"
              ? "Nova Reserva"
              : modalType === "edit"
              ? "Editar Reserva"
              : "Visualizar Reserva"
          }
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
              readOnly={modalType === "view"}
              disabled={modalType === "view"}
            />
            <Select
              label="Jogo"
              data={games}
              value={form.gameId}
              onChange={(value) => setForm((f) => ({ ...f, gameId: value }))}
              required
              radius={8}
              placeholder="Selecione o jogo"
              readOnly={modalType === "view"}
              disabled={modalType === "view"}
            />
            <TextInput
              label="Data da Reserva"
              type="datetime-local"
              value={form.reserveDate}
              onChange={(e) =>
                setForm((f) => ({ ...f, reserveDate: e.target.value }))
              }
              required
              radius={8}
              readOnly={modalType === "view"}
            />
            <TextInput
              label="Data de Aprovação"
              type="datetime-local"
              value={form.approveDate}
              onChange={(e) =>
                setForm((f) => ({ ...f, approveDate: e.target.value }))
              }
              radius={8}
              readOnly={modalType === "view"}
            />
            <TextInput
              label="Data de Devolução"
              type="datetime-local"
              value={form.returnDate}
              onChange={(e) =>
                setForm((f) => ({ ...f, returnDate: e.target.value }))
              }
              radius={8}
              readOnly={modalType === "view"}
            />
            {modalType !== "view" && (
              <Group position="right" mt="md">
                <Button
                  onClick={handleCreateOrEdit}
                  style={{ borderRadius: 8 }}
                >
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
              Tem certeza que deseja excluir a reserva de{" "}
              <b>{selectedOrder?.userName}</b> para o jogo{" "}
              <b>{selectedOrder?.gameName}</b>?
            </div>
            <Group position="right" mt="md">
              <Button
                variant="outline"
                onClick={() => setModalOpen(false)}
                style={{ borderRadius: 8 }}
              >
                Cancelar
              </Button>
              <Button
                color="red"
                onClick={handleDelete}
                style={{ borderRadius: 8 }}
              >
                Excluir
              </Button>
            </Group>
          </Stack>
        </Modal>
      </Container>
    </AppWrapper>
  );
}
