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
  NumberInput,
  Select,
  Paper,
  Box,
  Textarea,
  Tooltip,
  Card,
  SimpleGrid,
  Text,
} from "@mantine/core";
import { AppWrapper } from "../components/AppWrapper";
import { DataTable } from "../components/DataTable";
import api from "../http/api";
import { IconEdit, IconEye, IconTrash, IconPlus, IconDeviceGamepad2, IconStar } from "@tabler/icons-react";
import { toast } from "../utils/Toast";

export function Games() {
  const [games, setGames] = useState([]);
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
  const [selectedGame, setSelectedGame] = useState(null);

  // form states
  const [form, setForm] = useState({ name: "", price: "", description: "", consoleId: "" });
  const [consoles, setConsoles] = useState([]);

  const headers = [
    { label: "ID", key: "id" },
    { label: "Nome", key: "name" },
    { label: "Console", key: "consoleName" },
    { label: "Preço", key: "price" },
    { label: "Descrição", key: "description", render: (row) => (
      <Tooltip label={row.description} multiline maw={400} position="top-start">
        <span style={{ cursor: 'pointer', display: 'inline-block', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {row.description}
        </span>
      </Tooltip>
    ) },
  ];

  // função para abrir modal de criar/editar
  const openModal = (type, game = null) => {
    setModalType(type);
    setSelectedGame(game);
    setForm(
      game
        ? {
            name: game.name,
            price: game.price,
            description: game.description || "",
            consoleId: game.consoleId || (game.console ? game.console.id : ""),
          }
        : { name: "", price: "", description: "", consoleId: "" }
    );
    setModalOpen(true);
  };

  // crud actions
  const handleCreateOrEdit = async () => {
    try {
      const payload = {
        name: form.name,
        price: form.price,
        description: form.description,
        consoleId: Number(form.consoleId),
      };
      if (modalType === "create") {
        await api.post("/games", payload,);
      } else if (modalType === "edit" && selectedGame) {
        await api.put(`/games/${selectedGame.id}`, payload);
      }
      setModalOpen(false);
      fetchGames();
    } catch (e) {
      toast.error("Erro ao salvar jogo.");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/games/${selectedGame.id}`);
      setModalOpen(false);
      fetchGames();
    } catch (e) {
      toast.error("Erro ao deletar jogo.");
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
        setSelectedGame(row);
        setModalType("delete");
        setModalOpen(true);
      },
    },
  ];

  const fetchGames = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/games", {
        params: { page, limit, search, field, order },
      });
      setGames(
        (res.data.games || []).map((g) => ({
          ...g,
          consoleName: g.console ? g.console.name : "",
        }))
      );
      setTotal(res.data.total || 0);
    } catch (e) {
      setGames([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, field, order]);

  const fetchConsoles = useCallback(async () => {
    try {
      const res = await api.get("/consoles", {
        params: { limit: 100, page: 1 },
      });
      setConsoles((res.data.consoles || []).map((c) => ({ value: c.id + "", label: c.name })));
    } catch (e) {
      setConsoles([]);
    }
  }, []);

  useEffect(() => {
    fetchGames();
    // eslint-disable-next-line
  }, [page, limit, search, field, order]);

  useEffect(() => {
    fetchConsoles();
  }, [fetchConsoles]);

  // cards de resumo para jogos
  const totalJogos = games.length;
  // jogo mais alugado (pelo array atual, se houver campo de reservas)
  const topGame = games.reduce((acc, g) => (g.reserves && g.reserves.length > (acc?.reserves?.length || 0) ? g : acc), null);

  return (
    <AppWrapper>
      <Container size="lg" pt="xl">
        <Title order={2} mb="md" style={{ color: '#111' }}>Jogos</Title>
        <Text size="lg" weight={600} mb="xs" style={{ color: '#111' }}>Resumo dos Jogos</Text>
        <SimpleGrid cols={2} spacing="lg" mb="xl" breakpoints={[{ maxWidth: 900, cols: 1 }]}>
          <Card shadow="sm" p="lg" radius="md" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ background: '#e3f2fd', borderRadius: 12, padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconDeviceGamepad2 size={32} color="#1976d2" />
            </div>
            <div>
              <Text size="sm" color="dimmed">Total de Jogos</Text>
              <Text size="xl" weight={700}>{totalJogos}</Text>
            </div>
          </Card>
          <Card shadow="sm" p="lg" radius="md" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ background: '#fffde7', borderRadius: 12, padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconStar size={32} color="#ffb300" />
            </div>
            <div>
              <Text size="sm" color="dimmed">Jogo mais alugado</Text>
              <Text size="xl" weight={700}>{topGame ? topGame.name : '-'}</Text>
            </div>
          </Card>
        </SimpleGrid>
        <Text size="lg" weight={600} mb="xs" style={{ color: '#111' }}>Lista de Jogos</Text>
        <Group position="apart" mb="md">
          <Button leftSection={<IconPlus size={16} />} onClick={() => openModal("create")}
            style={{ borderRadius: 8, fontWeight: 600 }}>
            Novo Jogo
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
              data={games}
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
              placeholder="Buscar por nome"
              actions={actions}
            />
          )}
        </Box>
        {/* Modal de criar/editar/visualizar */}
        <Modal
          opened={modalOpen && ["create", "edit", "view"].includes(modalType)}
          onClose={() => setModalOpen(false)}
          title={modalType === "create" ? "Novo Jogo" : modalType === "edit" ? "Editar Jogo" : "Visualizar Jogo"}
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
            <NumberInput
              label="Preço"
              value={form.price}
              onChange={(value) => setForm((f) => ({ ...f, price: value }))}
              required
              min={0}
              precision={2}
              step={1}
              radius={8}
              parser={(value) => value?.replace(/[^0-9.,]/g, "")}
              formatter={(value) =>
                !Number.isNaN(parseFloat(value))
                  ? `R$ ${value}`
                  : ""
              }
              readOnly={modalType === "view"}
              disabled={modalType === "view"}
            />
            <Select
              label="Console"
              data={consoles}
              value={form.consoleId + ""}
              onChange={(value) => setForm((f) => ({ ...f, consoleId: value }))}
              required
              radius={8}
              placeholder="Selecione o console"
              readOnly={modalType === "view"}
              disabled={modalType === "view"}
            />
            <Textarea
              label="Descrição"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              radius={8}
              autosize
              minRows={2}
              maxRows={6}
              readOnly={modalType === "view"}
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
              Tem certeza que deseja excluir o jogo {" "}
              <b>{selectedGame?.name}</b>?
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
