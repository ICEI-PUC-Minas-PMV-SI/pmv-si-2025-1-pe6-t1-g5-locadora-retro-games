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
  Box,
  Card,
  SimpleGrid,
  Text,
} from "@mantine/core";
import { AppWrapper } from "../components/AppWrapper";
import { DataTable } from "../components/DataTable";
import axios from "axios";
import { IconEdit, IconEye, IconTrash, IconPlus, IconDeviceGamepad2, IconStar } from "@tabler/icons-react";
import { toast } from "../utils/Toast";

export function Consoles() {
  const [consoles, setConsoles] = useState([]);
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
  const [selectedConsole, setSelectedConsole] = useState(null);

  // form states
  const [form, setForm] = useState({ name: "" });

  const headers = [
    { label: "ID", key: "id" },
    { label: "Nome", key: "name" },
    { label: "Qtd. Jogos", key: "gamesCount" },
  ];

  // função para abrir modal de criar/editar
  const openModal = (type, consoleObj = null) => {
    setModalType(type);
    setSelectedConsole(consoleObj);
    setForm(consoleObj ? { name: consoleObj.name } : { name: "" });
    setModalOpen(true);
  };

  // crud actions
  const handleCreateOrEdit = async () => {
    try {
      const payload = { name: form.name };
      if (modalType === "create") {
        await axios.post("http://localhost:8080/consoles", payload, {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        });
      } else if (modalType === "edit" && selectedConsole) {
        await axios.put(`http://localhost:8080/consoles/${selectedConsole.id}`, payload, {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        });
      }
      setModalOpen(false);
      fetchConsoles();
    } catch (e) {
      toast.error("Erro ao salvar console.");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/consoles/${selectedConsole.id}`, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      });
      setModalOpen(false);
      fetchConsoles();
    } catch (e) {
      toast.error("Erro ao deletar console.");
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
        setSelectedConsole(row);
        setModalType("delete");
        setModalOpen(true);
      },
    },
  ];

  const fetchConsoles = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8080/consoles", {
        params: { page, limit, search, field, order },
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      });
      setConsoles(
        (res.data.consoles || []).map((c) => ({
          ...c,
          gamesCount: c._count ? c._count.games : 0,
        }))
      );
      setTotal(res.data.total || 0);
    } catch (e) {
      setConsoles([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, field, order]);

  useEffect(() => {
    fetchConsoles();
    // eslint-disable-next-line
  }, [page, limit, search, field, order]);

  // cards de resumo para consoles
  const totalConsoles = consoles.length;
  // console mais popular (pelo array atual, se houver campo de jogos)
  const topConsole = consoles.reduce((acc, c) => (c.gamesCount > (acc?.gamesCount || 0) ? c : acc), null);

  return (
    <AppWrapper>
      <Container size="lg" pt="xl">
        <Title order={2} mb="md" style={{ color: '#111' }}>Consoles</Title>
        <Text size="lg" weight={600} mb="xs" style={{ color: '#111' }}>Resumo dos Consoles</Text>
        <SimpleGrid cols={2} spacing="lg" mb="xl" breakpoints={[{ maxWidth: 900, cols: 1 }]}>
          <Card shadow="sm" p="lg" radius="md" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ background: '#ede7f6', borderRadius: 12, padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconDeviceGamepad2 size={32} color="#512da8" />
            </div>
            <div>
              <Text size="sm" color="dimmed">Total de Consoles</Text>
              <Text size="xl" weight={700}>{totalConsoles}</Text>
            </div>
          </Card>
          <Card shadow="sm" p="lg" radius="md" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ background: '#fffde7', borderRadius: 12, padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconStar size={32} color="#ffb300" />
            </div>
            <div>
              <Text size="sm" color="dimmed">Console com mais jogos</Text>
              <Text size="xl" weight={700}>{topConsole ? topConsole.name : '-'}</Text>
            </div>
          </Card>
        </SimpleGrid>
        <Text size="lg" weight={600} mb="xs" style={{ color: '#111' }}>Lista de Consoles</Text>
        <Group position="apart" mb="md">
          <Button leftSection={<IconPlus size={16} />} onClick={() => openModal("create")}
            style={{ borderRadius: 8, fontWeight: 600 }}>
            Novo Console
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
              data={consoles}
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
          title={modalType === "create" ? "Novo Console" : modalType === "edit" ? "Editar Console" : "Visualizar Console"}
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
              Tem certeza que deseja excluir o console {" "}
              <b>{selectedConsole?.name}</b>?
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
