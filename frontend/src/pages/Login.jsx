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
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import logo from "../images/logo.png";
import { toast } from "../utils/Toast";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
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
    }
  };

  return (
    <Center
      w="100%"
      h="100vh"
      style={{
        background: "linear-gradient(135deg, orange 0%, purple 100%)",
      }}
    >
      <Container
        bg="#fff"
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          padding: "3rem",
          gap: "15px",
        }}
      >
        <Stack
          bg="var(--mantine-color-body)"
          align="stretch"
          justify="center"
          gap="md"
        >
          <Image src={logo} w={256}></Image>
          <TextInput
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <PasswordInput
            label="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button variant="filled" fullWidth mt="md" onClick={handleLogin}>
            Login
          </Button>
        </Stack>
      </Container>
    </Center>
  );
}
