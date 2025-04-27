import { Container, Title, Button } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

export function GamesManagement() {
  const navigate = useNavigate();

  return (
    <Container>
      <Title>Welcome to Admin Panel</Title>
      <Button mt="md" onClick={() => navigate('/users')}>Manage Users</Button>
    </Container>
  );
}
