import { Container, Title, Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { AppWrapper } from "../components/AppWrapper";

export function Dashboard() {
  const navigate = useNavigate();

  return (
    <AppWrapper>
      <Container>
        <Title>Bem-vindo ao Painel de Administrador</Title>
        
      </Container>
    </AppWrapper>
  );
}
