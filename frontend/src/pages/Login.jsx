import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextInput,
  PasswordInput,
  Button,
  Container,
  Center,
  Image,
  Stack,
  Paper,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import logo from "../images/logo.png";
import bg from "../images/background.jpg";
import { toast } from "../utils/Toast";
import { useMediaQuery } from "@mantine/hooks";
import { IconMail, IconLock } from "@tabler/icons-react";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 600px)');

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8080/auth/login", {
        email,
        password,
      });

      if (response.data.user.roleId !== 1) throw new Error();
      toast.success('Bem-vindo!');
      localStorage.setItem("token", response.data.token); // Save token
      navigate("/"); // Redirect after login
    } catch (error) {
      toast.error('Credenciais inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Center
      w="100%"
      h="100vh"
      style={{
        position: 'relative',
        minHeight: '100vh',
        padding: isMobile ? 0 : undefined,
        overflow: 'hidden',
      }}
    >
      {/* Background image */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          background: `url(${bg}) center/cover no-repeat`,
          zIndex: 0,
        }}
      />
      {/* Gradient overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, orange 0%, purple 100%)',
          opacity: 0.82,
          zIndex: 1,
        }}
      />
      <Paper
        shadow="xl"
        p={isMobile ? "md" : 72}
        radius={36}
        style={{
          maxWidth: isMobile ? 504 : 576, // 120% maior
          width: "100%",
          minWidth: isMobile ? 'unset' : 408,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <Image src={logo} w={isMobile ? 216 : 312} mx="auto" mb={isMobile ? 14 : 32} />
        <Container
          bg="transparent"
          style={{
            width: '100%',
            maxWidth: 480,
            padding: 0,
          }}
        >
          <Stack
            align="stretch"
            justify="center"
            gap="lg"
          >
            <TextInput
              label="Email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftSection={<IconMail size={18} />}
              autoFocus
              required
              size={isMobile ? 'sm' : 'md'}
            />
            <PasswordInput
              label="Senha"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftSection={<IconLock size={18} />}
              required
              size={isMobile ? 'sm' : 'md'}
              onKeyDown={e => { if (e.key === 'Enter') handleLogin(); }}
            />
            <Button
              variant="gradient"
              gradient={{ from: 'orange', to: 'purple', deg: 90 }}
              fullWidth
              mt="md"
              size={isMobile ? 'sm' : 'md'}
              onClick={handleLogin}
              loading={loading}
              style={{ fontWeight: 600, borderRadius: 8, marginTop: 8 }}
            >
              {loading ? 'Entrando...' : 'Login'}
            </Button>
          </Stack>
        </Container>
      </Paper>
    </Center>
  );
}
