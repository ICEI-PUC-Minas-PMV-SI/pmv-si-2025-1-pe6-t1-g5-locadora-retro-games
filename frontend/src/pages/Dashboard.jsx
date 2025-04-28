import { Container, Title, Button } from "@mantine/core";
import { AppWrapper } from "../components/AppWrapper";
import { useEffect, useState } from "react";
import { Group, Card, Text, SimpleGrid, Loader, Badge, Table, Stack } from "@mantine/core";
import axios from "axios";
import { toast } from "../utils/Toast";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { IconCalendar, IconCurrencyDollar, IconUser, IconClock, IconAlertTriangle } from '@tabler/icons-react';

function StatCard({ icon, color, label, value }) {
  return (
    <Card shadow="sm" p="lg" radius="md" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ background: color, borderRadius: 12, padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </div>
      <div>
        <Text size="sm" color="dimmed">{label}</Text>
        <Text size="xl" weight={700}>{value}</Text>
      </div>
    </Card>
  );
}

export function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:8080/dashboard/summary", {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        });
        setData(res.data);
      } catch (e) {
        toast.error("Erro ao carregar dados do dashboard");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <AppWrapper>
        <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
          <Loader size={48} color="orange" />
        </Container>
      </AppWrapper>
    );
  }

  if (!data) {
    return (
      <AppWrapper>
        <Container><Text>Não foi possível carregar os dados.</Text></Container>
      </AppWrapper>
    );
  }

  return (
    <AppWrapper>
      <Container size="xl" py="lg" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Title order={2} mb="md" style={{ color: '#111', textAlign: 'center' }}>Dashboard</Title>
        <SimpleGrid cols={3} spacing="lg" breakpoints={[{ maxWidth: 900, cols: 2 }, { maxWidth: 600, cols: 1 }]} style={{ maxWidth: 1100, margin: '0 auto' }}> 
          <StatCard icon={<IconCalendar size={32} color="#1976d2" />} color="#e3f2fd" label="Reservas" value={data.totalReservas} />
          <StatCard icon={<IconCurrencyDollar size={32} color="#388e3c" />} color="#e8f5e9" label="Receita Total" value={`R$ ${data.totalReceita?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
          <StatCard icon={<IconCurrencyDollar size={32} color="#7b1fa2" />} color="#f3e5f5" label="Receita do Mês" value={`R$ ${data.receitaMesAtual?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
          <StatCard icon={<IconUser size={32} color="#512da8" />} color="#ede7f6" label="Usuários Ativos no Mês" value={data.usuariosAtivosMes} />
          <StatCard icon={<IconClock size={32} color="#ffb300" />} color="#fff8e1" label="Reservas Pendentes" value={data.reservasPendentes} />
          <StatCard icon={<IconAlertTriangle size={32} color="#e53935" />} color="#ffebee" label="Reservas Atrasadas" value={data.reservasAtrasadas} />
        </SimpleGrid>
        <Group mt="xl" align="flex-start" spacing="lg" position="apart" style={{ maxWidth: 1100, width: '100%', margin: '0 auto' }}>
          <Card shadow="sm" p="md" radius="md" style={{ flex: 2, minWidth: 320 }}>
            <Text weight={700} mb={8} style={{ color: '#000'}}>Reservas por mês</Text>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={Array.isArray(data.reservasPorMes) ? data.reservasPorMes : []} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <XAxis dataKey="mes" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="total" fill="#1976d2" radius={[8,8,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
          <Card shadow="sm" p="md" radius="md" style={{ flex: 1, minWidth: 220 }}>
            <Text weight={700} mb={8} style={{ color: '#000'}}>Status dos Pagamentos</Text>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={Array.isArray(data.statusPagamentosPie) ? data.statusPagamentosPie : []} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                  {(data.statusPagamentosPie || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Group>
        <Group mt="xl" align="flex-start" spacing="lg" position="apart" style={{ maxWidth: 1100, width: '100%', margin: '0 auto' }}>
          <Card shadow="sm" p="md" radius="md" style={{ flex: 1, minWidth: 320 }}>
            <Text weight={700} mb={8} style={{ color: '#000'}}>Jogos mais alugados</Text>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={Array.isArray(data.jogosMaisAlugados) ? data.jogosMaisAlugados : []} layout="vertical" margin={{ left: 24 }}>
                <XAxis type="number" allowDecimals={false} />
                <YAxis dataKey="name" type="category" width={120} />
                <Tooltip />
                <Bar dataKey="total" fill="#7b1fa2" radius={[0,8,8,0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
          <Card shadow="sm" p="md" radius="md" style={{ flex: 1, minWidth: 320 }}>
            <Text weight={700} mb={8} style={{ color: '#000'}}>Consoles mais populares</Text>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={Array.isArray(data.consolesMaisPopulares) ? data.consolesMaisPopulares : []} layout="vertical" margin={{ left: 24 }}>
                <XAxis type="number" allowDecimals={false} />
                <YAxis dataKey="name" type="category" width={120} />
                <Tooltip />
                <Bar dataKey="total" fill="#388e3c" radius={[0,8,8,0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Group>
        <Card shadow="sm" p="md" radius="md" mt="xl" style={{ maxWidth: 1100, margin: '0 auto', width: '100%' }}>
          <Text weight={700} mb={8} style={{ color: '#000'}}>Últimas Reservas</Text>
          <Table striped highlightOnHover style={{ minWidth: 600, textAlign: 'left' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Usuário</th>
                <th style={{ textAlign: 'left' }}>Jogo</th>
                <th style={{ textAlign: 'left' }}>Data</th>
                <th style={{ textAlign: 'left' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {(Array.isArray(data.ultimasReservas) ? data.ultimasReservas : []).map((r, i) => (
                <tr key={i}>
                  <td style={{ textAlign: 'left' }}>{r.user?.name || r.userId}</td>
                  <td style={{ textAlign: 'left' }}>{r.game?.name || r.gameId}</td>
                  <td style={{ textAlign: 'left' }}>{new Date(r.reserveDate).toLocaleString('pt-BR')}</td>
                  <td style={{ textAlign: 'left' }}><Badge color={r.statusReserve?.id === 1 ? 'blue' : r.statusReserve?.id === 2 ? 'green' : r.statusReserve?.id === 3 ? 'red' : 'yellow'}>{r.statusReserve?.name || r.statusReserveId}</Badge></td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      </Container>
    </AppWrapper>
  );
}
