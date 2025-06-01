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
  Badge,
  Card,
  SimpleGrid,
  Text,
  TextInput,
  Flex,
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
import { forwardRef } from "react";
import { toast } from "../utils/Toast";

export function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPending, setTotalPending] = useState(0);
  const [totalOverdue, setTotalOverdue] = useState(0);
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
    { label: "Dt. Reserva", key: "reserveDate", type: "date" },
    { label: "Dt. Aprovação", key: "approveDate", type: "date" },
    { label: "Dt. Devolução", key: "returnDate", type: "date" },
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
            statusReserveId: order.statusReserveId, // Ensure correct status is set
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
            statusReserveId: "4", // Default to pending
            reserveDate: moment().format("YYYY-MM-DDTHH:mm"),
            approveDate: "",
            returnDate: "",
          }
    );
    setModalOpen(true);
  };

  const validateForm = () => {
    if (!form.userId) {
      toast.error("Usuário é obrigatório.");
      return false;
    }
    if (!form.gameId) {
      toast.error("Jogo é obrigatório.");
      return false;
    }
    if (!form.reserveDate) {
      toast.error("Data de Reserva é obrigatória.");
      return false;
    }
    if (
      (form.statusReserveId === 1 || form.statusReserveId === 2) &&
      !form.approveDate
    ) {
      toast.error("Data de Aprovação é obrigatória para o status selecionado.");
      return false;
    }
    if (
      (form.statusReserveId === 1 || form.statusReserveId === 2) &&
      form.approveDate &&
      moment(form.approveDate).isBefore(moment(form.reserveDate))
    ) {
      toast.error("Data de Aprovação deve ser maior que a Data de Reserva.");
      return false;
    }
    if (form.statusReserveId === 2 && !form.returnDate) {
      toast.error("Data de Devolução é obrigatória para o status selecionado.");
      return false;
    }

    if (
      form.statusReserveId === 2 &&
      form.returnDate &&
      moment(form.returnDate).isBefore(moment(form.approveDate))
    ) {
      toast.error("Data de Devolução deve ser maior que a Data de Reserva.");
      return false;
    }
    return true;
  };

  // crud actions
  const handleCreateOrEdit = async () => {
    if (!validateForm()) return;

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
      toast.success(
        modalType === "create"
          ? "Reserva criada com sucesso!"
          : "Reserva atualizada com sucesso!"
      );
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
      toast.success("Reserva excluída com sucesso!");
      setModalOpen(false);
      fetchOrders();
    } catch (e) {
      toast.error("Erro ao deletar reserva.");
    }
  };

  const handleStatusChangeInModal = (newStatusId) => {
    setForm((prevForm) => {
      const updatedForm = { ...prevForm, statusReserveId: newStatusId };

      if (newStatusId === 4) {
        // Pendente
        updatedForm.approveDate = "";
        updatedForm.returnDate = "";
      } else if (newStatusId === 1) {
        // Reservado
        updatedForm.returnDate = "";
      }

      return updatedForm;
    });
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
      const res = await api.get("/orders", {
        params: { page, limit, search, field, order },
      });
      setOrders(
        (res.data.orders || []).map((o) => ({
          ...o,
          userName: o.user.name,
          gameName: o.game.name,
          statusName:
            statuses.find(
              (s) => s.value == (o.statusReserveId || o.statusReserveId)
            )?.label || o.statusReserveId,
        }))
      );
      setTotal(res.data.totalItems || 0);
      setTotalOverdue(res.data.totalOverdue || 0);
      setTotalPending(res.data.totalPeding || 0);
    } catch (e) {
      setOrders([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, field, order, statuses]);

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
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, field, order]);

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, [page, limit, search, field, order]);

  useEffect(() => {
    fetchUsers();
    fetchGames();
  }, [fetchUsers, fetchGames]);

  const renderDateInputs = () => {
    const isPending = form.statusReserveId === 4;
    const isCancelled = form.statusReserveId === 3;
    const isReturned = form.statusReserveId === 2;
    const isReserved = form.statusReserveId === 1;

    return (
      <>
        {/* Data de Reserva - Sempre exibida e obrigatória */}
        <TextInput
          label="Data de Reserva"
          type="datetime-local"
          value={form.reserveDate}
          onChange={(event) =>
            setForm((f) => ({ ...f, reserveDate: event.target.value }))
          }
          required
          radius={8}
          readOnly={modalType === "view"}
        />

        {/* Data de Aprovação - Exibida para Reservado e Devolvido */}
        {(isReserved || isCancelled || isReturned) && (
          <TextInput
            label="Data de Aprovação"
            type="datetime-local"
            value={form.approveDate}
            onChange={(event) =>
              setForm((f) => ({ ...f, approveDate: event.target.value }))
            }
            required={isReserved || isReturned}
            radius={8}
            readOnly={modalType === "view"}
          />
        )}

        {/* Data de Devolução - Exibida para Cancelado e Devolvido */}
        {(isCancelled || isReturned) && (
          <TextInput
            label="Data de Devolução"
            type="datetime-local"
            value={form.returnDate}
            onChange={(event) =>
              setForm((f) => ({ ...f, returnDate: event.target.value }))
            }
            required={isReturned}
            radius={8}
            readOnly={modalType === "view"}
          />
        )}
      </>
    );
  };

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
                {total}
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
                {totalPending}
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
                {totalOverdue}
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
            <Flex justify="center" align="center">
              <Loader />
            </Flex>
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
              fetchData={fetchOrders}
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
              readOnly={modalType === "view" || modalType === "edit"}
              disabled={modalType === "view" || modalType === "edit"}
            />
            <Select
              label="Jogo"
              data={games}
              value={form.gameId}
              onChange={(value) => setForm((f) => ({ ...f, gameId: value }))}
              required
              radius={8}
              placeholder="Selecione o jogo"
              readOnly={modalType === "view" || modalType === "edit"}
              disabled={modalType === "view" || modalType === "edit"}
            />
            {modalType !== "create" && (
              <Select
                label="Status"
                data={statuses}
                value={form.statusReserveId + ""}
                onChange={(value) => handleStatusChangeInModal(Number(value))}
                required
                radius={8}
                placeholder="Selecione o status"
                readOnly={modalType === "view"}
                disabled={modalType === "view"}
                itemComponent={forwardRef(({ value, label, ...rest }, ref) => (
                  <div
                    ref={ref}
                    {...rest}
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <Badge
                      color={statusColors[value] || "gray"}
                      variant="filled"
                    >
                      {label}
                    </Badge>
                  </div>
                ))}
                renderValue={(selected) => {
                  const status = statuses.find((s) => s.value === selected);
                  return (
                    <Badge
                      color={statusColors[selected] || "gray"}
                      variant="filled"
                    >
                      {status ? status.label : selected}
                    </Badge>
                  );
                }}
              />
            )}
            {renderDateInputs()}
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
