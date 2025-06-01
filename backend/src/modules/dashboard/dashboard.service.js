import prisma from '../../infra/prisma/prisma.js';
import ORDER_STATUS_ENUM from '../../utils/orderStatus.enum.js';
import AsaasService from '../order/asaas.service.js';

const DashboardService = {};

DashboardService.getSummary = async () => {
  // Total de reservas
  const totalReservas = await prisma.reserve.count();

  // Total de receita (Asaas)
  // Aqui você pode usar a integração do Asaas para buscar o valor total recebido
  let totalReceita = 0;
  let receitaMesAtual = 0;
  let statusPagamentos = { pagos: 0, pendentes: 0, cancelados: 0 };
  try {
    const asaasData = await AsaasService.getDashboardSummary();
    totalReceita = asaasData.totalReceita;
    receitaMesAtual = asaasData.receitaMesAtual;
    statusPagamentos = asaasData.statusPagamentos;
  } catch (e) {}

  // Reservas por mês (últimos 6 meses, com mês formatado)
  const mesesLabels = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    mesesLabels.push(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`);
  }
  const reservasPorMesRaw = await prisma.reserve.findMany({
    where: { reserveDate: { gte: new Date(mesesLabels[0] + '-01') } },
    select: { reserveDate: true }
  });
  const reservasPorMesMap = {};
  reservasPorMesRaw.forEach(r => {
    const d = new Date(r.reserveDate);
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
    reservasPorMesMap[key] = (reservasPorMesMap[key] || 0) + 1;
  });
  const reservasPorMes = mesesLabels.map(mes => ({ mes, total: reservasPorMesMap[mes] || 0 }));

  // Jogos mais alugados (top 5, com nome e preço)
  const jogosMaisAlugadosRaw = await prisma.reserve.groupBy({
    by: ['gameId'],
    _count: { gameId: true },
    orderBy: { _count: { gameId: 'desc' } },
    take: 5,
  });
  const jogosIds = jogosMaisAlugadosRaw.map(j => j.gameId);
  const jogosNomes = await prisma.game.findMany({ where: { id: { in: jogosIds } }, select: { id: true, name: true, price: true } });
  const jogosMaisAlugados = jogosMaisAlugadosRaw.map(j => ({
    name: jogosNomes.find(g => g.id === j.gameId)?.name || `ID ${j.gameId}`,
    price: jogosNomes.find(g => g.id === j.gameId)?.price?.toNumber() || 0,
    total: j._count.gameId
  }));

  // Consoles mais populares (top 5, com nome)
  const consolesMaisPopularesRaw = await prisma.game.groupBy({
    by: ['consoleId'],
    _count: { consoleId: true },
    orderBy: { _count: { consoleId: 'desc' } },
    take: 5,
  });
  const consolesIds = consolesMaisPopularesRaw.map(c => c.consoleId);
  const consolesNomes = await prisma.console.findMany({ where: { id: { in: consolesIds } }, select: { id: true, name: true } });
  const consolesMaisPopulares = consolesMaisPopularesRaw.map(c => ({
    name: consolesNomes.find(g => g.id === c.consoleId)?.name || `ID ${c.consoleId}`,
    total: c._count.consoleId
  }));

  // Usuários ativos no mês
  const inicioMes = new Date();
  inicioMes.setDate(1);
  inicioMes.setHours(0,0,0,0);
  // Corrigido: findMany + Set para contar usuários distintos
  const reservasDoMes = await prisma.reserve.findMany({
    where: { reserveDate: { gte: inicioMes } },
    select: { userId: true }
  });
  const usuariosAtivosMes = new Set(reservasDoMes.map(r => r.userId)).size;
  // Reservas pendentes
  const reservasPendentes = await prisma.reserve.count({ where: { statusReserveId: 4 } });
  // Reservas atrasadas (status pendente e data de retorno menor que hoje)
  const reservasAtrasadasPorDevolucao = await prisma.$queryRawUnsafe(
    `SELECT COUNT(*) AS overdueReturnCount
     FROM "Reserve"
     WHERE "Reserve"."returnDate" > ("Reserve"."approveDate" + INTERVAL '15 days');`
  );
  const reservasAtrasadasPorDevolucaoCount = parseInt(reservasAtrasadasPorDevolucao[0].overduereturncount, 10);
  const reservasAtrasadasAposAprovacao = await prisma.reserve.count({
    where: {
      statusReserveId: ORDER_STATUS_ENUM.ORDERED,
      approveDate: { lte: new Date(new Date().setDate(new Date().getDate() - 15)) },
      returnDate: null
    }
  });
  const totalReservasAtrasadas = reservasAtrasadasAposAprovacao + reservasAtrasadasPorDevolucaoCount;
  // Últimas reservas (com nome do status)
  const ultimasReservas = await prisma.reserve.findMany({
    orderBy: { reserveDate: 'desc' },
    take: 5,
    include: { user: true, game: true, statusReserve: true }
  });

  // Status dos pagamentos para gráfico de pizza
  const statusPagamentosPie = [
    { name: 'Pagos', value: statusPagamentos.pagos, color: '#4caf50' },
    { name: 'Pendentes', value: statusPagamentos.pendentes, color: '#ffb300' },
    { name: 'Cancelados', value: statusPagamentos.cancelados, color: '#e53935' },
  ];

  return {
    totalReservas,
    totalReceita,
    receitaMesAtual,
    reservasPorMes,
    jogosMaisAlugados,
    consolesMaisPopulares,
    usuariosAtivosMes,
    reservasPendentes,
    reservasAtrasadas: totalReservasAtrasadas,
    ultimasReservas,
    statusPagamentos,
    statusPagamentosPie
  };
};

export default DashboardService;
