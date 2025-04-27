import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextInput, PasswordInput, Button, Container, Title } from '@mantine/core';
import axios from 'axios';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('https://localhost:8080/login', { email, password });
      
      if(response.data.user.roleId !== 1) throw new Error();

      localStorage.setItem('token', response.data.token);  // Save token
      navigate('/games'); // Redirect after login
    } catch (error) {
      alert('Invalid credentials');
    }
  };

  return (
    <Container size={400}>
      <Title align="center">Acesso ao Administrador NintendIN</Title>
      <TextInput label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <PasswordInput label="Senha" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button variant="filled" fullWidth mt="md" onClick={handleLogin}>Login</Button>
    </Container>
  );
}
