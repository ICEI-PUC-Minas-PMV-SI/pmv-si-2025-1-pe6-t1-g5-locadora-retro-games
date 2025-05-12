import {
  ActionIcon,
  AppShell,
  Burger,
  Center,
  Flex,
  Image,
  NavLink,
  Modal,
  Stack,
  Text,
  Button,
  Group,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconDeviceGamepad2,
  IconDeviceNintendo,
  IconDoorExit,
  IconHome,
  IconUser,
  IconCalendarStats,
} from "@tabler/icons-react";
import logo from "../images/logo.png";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../http/api";
import { toast } from "../utils/Toast";

export function AppWrapper({ children }) {
  const [opened, { toggle }] = useDisclosure();
  const location = useLocation();
  const navigate = useNavigate();
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    if (userModalOpen && !userInfo) {
      // busca dados do usuário logado
      api
        .get("/users/userAdmin")
        .then((res) => setUserInfo(res.data))
        .catch(() => setUserInfo(null));
    }
  }, [userModalOpen, userInfo]);

  function logout() {
    toast.success("Até a próxima!");
    if (localStorage.getItem("token")) {
      localStorage.removeItem("token");
    }
    navigate("/login");
  }

  function handleUserClick() {
    setUserModalOpen(true);
  }

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Flex w="100%" justify="space-between" align="center" direction="row">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Center w={256}>
            <Image src={logo} w={128}></Image>
          </Center>
          <Center w={60}>
            <ActionIcon
              w={30}
              bd={100}
              justify="center"
              onClick={handleUserClick}
              style={{ cursor: "pointer" }}
            >
              <IconUser size={16} stroke={1.5} />
            </ActionIcon>
          </Center>
        </Flex>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <AppShell.Section grow>
          <NavLink
            label="Dashboard"
            active={location.pathname == "/" ? true : false}
            onClick={() => navigate("/")}
            leftSection={<IconHome size={16} stroke={1.5} />}
          />
          <NavLink
            label="Usuários"
            active={location.pathname == "/usuarios" ? true : false}
            onClick={() => navigate("/usuarios")}
            leftSection={<IconUser size={16} stroke={1.5} />}
          />
          <NavLink
            label="Jogos"
            active={location.pathname == "/jogos" ? true : false}
            onClick={() => navigate("/jogos")}
            leftSection={<IconDeviceGamepad2 size={16} stroke={1.5} />}
          />
          <NavLink
            label="Consoles"
            active={location.pathname == "/consoles" ? true : false}
            onClick={() => navigate("/consoles")}
            leftSection={<IconDeviceNintendo size={16} stroke={1.5} />}
          />
          <NavLink
            label="Reservas"
            active={location.pathname == "/reservas" ? true : false}
            onClick={() => navigate("/reservas")}
            leftSection={<IconCalendarStats size={16} stroke={1.5} />}
          />
        </AppShell.Section>
        <AppShell.Section>
          <NavLink
            label="Sair"
            style={{ fontWeight: "bold" }}
            c="red"
            onClick={() => logout()}
            leftSection={<IconDoorExit size={16} stroke={1.5} />}
          />
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main
        style={{
          background: "linear-gradient(120deg,rgb(255, 255, 255) 0%,rgb(250, 248, 252) 100%)",
        }}
      >
        <div
          style={{
            width: "100%",
          }}
        >
          {children}
        </div>
      </AppShell.Main>

      <Modal
        opened={userModalOpen}
        onClose={() => setUserModalOpen(false)}
        title={
          <span style={{ color: "#9333ea", fontWeight: "bold", fontSize: 20 }}>
            Minha Conta
          </span>
        }
        centered
        radius={16}
        padding={24}
        styles={{
          body: { padding: 24 },
          content: { borderRadius: 16, minWidth: 320 },
        }}
      >
        <Stack gap={8} style={{ padding: 8 }}>
          {userInfo ? (
            <>
              <Text size="md">
                <b>Nome:</b> {userInfo.name}
              </Text>
              <Text size="md">
                <b>Email:</b> {userInfo.email}
              </Text>
              <Text size="md">
                <b>CPF:</b>{" "}
                {userInfo.cpf?.replace(
                  /(\d{3})(\d{3})(\d{3})(\d{2})/,
                  "$1.$2.$3-$4"
                )}
              </Text>
              <Text size="md">
                <b>Tipo:</b> {userInfo.role?.name || "Admin"}
              </Text>
            </>
          ) : (
            <Text>Carregando...</Text>
          )}
        </Stack>
      </Modal>
    </AppShell>
  );
}
