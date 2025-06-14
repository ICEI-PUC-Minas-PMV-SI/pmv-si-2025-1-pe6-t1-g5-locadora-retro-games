import prisma from "../../infra/prisma/prisma.js";
import { nanoid } from "nanoid";
import AsaasService from "./asaas.service.js";
import ORDER_STATUS_ENUM from "../../utils/orderStatus.enum.js";

const OrderService = {};

// Funções auxiliares para controle de estoque
OrderService.updateGameStock = async (gameId, change) => {
  console.log(`📦 Updating stock for game ${gameId}: ${change > 0 ? '+' : ''}${change}`);
  
  const result = await prisma.game.update({
    where: { id: Number(gameId) },
    data: {
      amount: {
        increment: change
      }
    },
    select: { id: true, name: true, amount: true }
  });
  
  console.log(`✅ Game ${result.name} stock updated. New amount: ${result.amount}`);
  return result;
};

OrderService.decreaseGameStock = async (gameId) => {
  return await OrderService.updateGameStock(gameId, -1);
};

OrderService.increaseGameStock = async (gameId) => {
  return await OrderService.updateGameStock(gameId, 1);
};

// Função para gerenciar mudanças de estoque baseadas na transição de status
OrderService.handleStockChangeForStatusUpdate = async (gameId, oldStatus, newStatus) => {
  console.log(`📦 Handling stock change for game ${gameId}: status ${oldStatus} → ${newStatus}`);
  
  // Status que "consomem" estoque: PENDING, ORDERED
  // Status que "devolvem" estoque: CANCELLED, RETURNED
  
  const stockConsumingStatuses = [ORDER_STATUS_ENUM.PENDING, ORDER_STATUS_ENUM.ORDERED];
  const stockReturningStatuses = [ORDER_STATUS_ENUM.CANCELLED, ORDER_STATUS_ENUM.RETURNED];
  
  const oldConsumesStock = stockConsumingStatuses.includes(oldStatus);
  const newConsumesStock = stockConsumingStatuses.includes(newStatus);
  
  if (oldConsumesStock && !newConsumesStock) {
    // Estava consumindo estoque e agora não está mais → devolver estoque (+1)
    console.log(`📈 Restoring stock for game ${gameId} (status change: ${oldStatus} → ${newStatus})`);
    await OrderService.increaseGameStock(gameId);
  } else if (!oldConsumesStock && newConsumesStock) {
    // Não estava consumindo estoque e agora está → decrementar estoque (-1)
    console.log(`📉 Consuming stock for game ${gameId} (status change: ${oldStatus} → ${newStatus})`);
    await OrderService.decreaseGameStock(gameId);
  }
  // Se ambos consomem ou ambos devolvem, não há mudança no estoque
};

OrderService.list = async (limit, offset, field, order, search) => {
  let orderBy = { [field]: order };
  if (field == "userName") {
    orderBy = {
      user: {
        name: order,
      },
    };
  } else if (field == "gameName") {
    orderBy = {
      game: {
        name: order,
      },
    };
  } else if (field == "statusName") {
    orderBy = {
      statusReserve: {
        name: order,
      },
    };
  }
  const query = {
    take: limit,
    skip: offset,
    orderBy,
    include: {
      user: true,
      game: true,
    },
    where: {
      OR: [
        { user: { name: { contains: search || "", mode: "insensitive" } } },
        { game: { name: { contains: search || "", mode: "insensitive" } } },
      ],
    },
  };

  const overdueReturnCountResult = await prisma.$queryRawUnsafe(
    `SELECT COUNT(*) AS overdueReturnCount
     FROM "Reserve"
     WHERE "Reserve"."returnDate" > ("Reserve"."approveDate" + INTERVAL '15 days');`
  );
  const overdueReturnCount = parseInt(overdueReturnCountResult[0].overduereturncount, 10);

  const [reserves, total, pendingCount, overdueCount] = await Promise.all([
    prisma.reserve.findMany(query),
    prisma.reserve.count(),
    prisma.reserve.count({
      where: {
        statusReserveId: ORDER_STATUS_ENUM.PENDING,
      },
    }),
    prisma.reserve.count({
      where: {
        statusReserveId: ORDER_STATUS_ENUM.ORDERED,
        approveDate: {
          lte: new Date(new Date().setDate(new Date().getDate() - 15)),
        },
        returnDate: null,
      },
    }),
  ]);

  const totalOverdueCount = overdueCount + overdueReturnCount;
  return { reserves, total, pendingCount, totalOverdueCount };
};

OrderService.getOrdersFromUser = async (userId) => {
  const userReserves = await prisma.reserve.findMany({
    where: { userId: Number(userId) },
    include: {
      game: {
        include: {
          console: true,
        },
      },
      statusReserve: true,
    },
    orderBy: {
      reserveDate: 'desc',
    },
  });

  // Agrupar reservas por pedido (orderId)
  const groupedOrders = {};
  
  userReserves.forEach(reserve => {
    // Extrair o orderId do ID da reserva (formato: orderId-gameId-index)
    const orderId = reserve.id.split('-')[0];
    
    if (!groupedOrders[orderId]) {
      groupedOrders[orderId] = {
        id: orderId,
        userId: reserve.userId,
        statusReserveId: reserve.statusReserveId,
        reserveDate: reserve.reserveDate,
        approveDate: reserve.approveDate,
        returnDate: reserve.returnDate,
        games: [],
        totalAmount: 0,
      };
    }
    
    // Adicionar jogo ao grupo
    groupedOrders[orderId].games.push({
      id: reserve.game.id,
      name: reserve.game.name,
      price: Number(reserve.game.price),
      console: reserve.game.console,
    });
    
    // Somar ao total
    groupedOrders[orderId].totalAmount += Number(reserve.game.price);
  });

  // Converter objeto em array e ordenar por data
  const ordersArray = Object.values(groupedOrders).sort((a, b) => 
    new Date(b.reserveDate).getTime() - new Date(a.reserveDate).getTime()
  );
  
  console.log(`📋 Found ${userReserves.length} reserves grouped into ${ordersArray.length} orders for user ${userId}`);
  
  return ordersArray;
};

OrderService.insertOrder = async ({ userId, gameList }) => {
  const orderId = nanoid(12);
  
  console.log('📋 Raw gameList received:', gameList);
  console.log('📊 GameList length:', gameList.length);
  
  // Contar quantidades de cada jogo
  const gameCounts = {};
  gameList.forEach(gameId => {
    const id = Number(gameId);
    gameCounts[id] = (gameCounts[id] || 0) + 1;
  });
  
  console.log('🎮 Game counts:', gameCounts);
  
  // Calcular total de reservas que serão criadas
  const totalReserves = Object.values(gameCounts).reduce((sum, count) => sum + count, 0);
  console.log('🔢 Total reserves to create:', totalReserves);
  
  // Verificar se há estoque suficiente antes de criar as reservas
  for (const [gameId, quantity] of Object.entries(gameCounts)) {
    const game = await prisma.game.findUnique({
      where: { id: Number(gameId) },
      select: { id: true, name: true, amount: true }
    });
    
    if (!game) {
      throw new Error(`Game with ID ${gameId} not found`);
    }
    
    if (game.amount < quantity) {
      throw new Error(`Insufficient stock for game "${game.name}". Available: ${game.amount}, Requested: ${quantity}`);
    }
  }
  
  // Criar uma reserva para cada jogo único
  // Nota: O schema atual não suporta quantity, então cada reserva representa 1 unidade
  // Para múltiplas unidades do mesmo jogo, precisaríamos criar múltiplas reservas com IDs únicos
  const reservePromises = [];
  const stockUpdates = [];
  
  for (const [gameId, quantity] of Object.entries(gameCounts)) {
    console.log(`🎯 Creating ${quantity} reserves for game ${gameId}`);
    // Criar múltiplas reservas para o mesmo jogo (uma para cada unidade)
    for (let i = 0; i < quantity; i++) {
      const uniqueReserveId = `${orderId}-${gameId}-${i}`;
      console.log(`📝 Creating reserve with ID: ${uniqueReserveId}`);
      reservePromises.push(
        prisma.reserve.create({
          data: {
            id: uniqueReserveId,
            userId: Number(userId),
            gameId: Number(gameId),
            statusReserveId: ORDER_STATUS_ENUM.PENDING,
            reserveDate: new Date(),
          },
        })
      );
      
      // Decrementar estoque para cada reserva PENDING
      stockUpdates.push(OrderService.decreaseGameStock(Number(gameId)));
    }
  }
  
  console.log(`✅ About to create ${reservePromises.length} reserves and update stock`);
  
  // Executar criação das reservas e atualização de estoque em paralelo
  await Promise.all([
    ...reservePromises,
    ...stockUpdates
  ]);
  
  console.log(`🎉 Successfully created ${reservePromises.length} reserves and updated stock for order ${orderId}`);
  
  return orderId;
};

OrderService.checkout = async (params, value, customer, order) => {
  const asaasOrderId = await AsaasService.payment(params, customer, value);
  if (!asaasOrderId) return false;
  await OrderService.confirmOrder(order);
  return true;
};

OrderService.getCustomerData = async (id) => {
  const customer = await prisma.user.findUnique({
    where: { id: Number(id) },
  });
  return customer;
};

OrderService.confirmOrder = async (order) => {
  console.log('🔄 Confirming order:', order.id, 'for user:', order.user);
  
  // Encontrar todas as reservas que começam com o orderId
  // Isso funciona porque criamos IDs como: orderId-gameId-index
  const result = await prisma.reserve.updateMany({
    where: {
      id: {
        startsWith: order.id
      },
      userId: Number(order.user),
    },
    data: {
      statusReserveId: ORDER_STATUS_ENUM.ORDERED,
      approveDate: new Date(),
      returnDate: new Date(new Date().setDate(new Date().getDate() + 15)),
    },
  });
  
  console.log(`✅ Updated ${result.count} reserves to ORDERED status`);
  return true;
};

OrderService.cancelOrder = async (order) => {
  console.log('❌ Cancelling order:', order.id);
  
  // Primeiro, buscar todas as reservas que serão canceladas para atualizar o estoque
  const reservesToCancel = await prisma.reserve.findMany({
    where: {
      id: {
        startsWith: order.id
      },
      statusReserveId: {
        in: [ORDER_STATUS_ENUM.PENDING, ORDER_STATUS_ENUM.ORDERED]
      }
    },
    select: { id: true, gameId: true, statusReserveId: true }
  });
  
  console.log(`📦 Found ${reservesToCancel.length} reserves to cancel and restore stock`);
  
  // Atualizar status das reservas
  const result = await prisma.reserve.updateMany({
    where: {
      id: {
        startsWith: order.id
      },
    },
    data: {
      statusReserveId: ORDER_STATUS_ENUM.CANCELLED,
    },
  });
  
  // Devolver estoque para cada reserva cancelada
  const stockUpdates = reservesToCancel.map(reserve => 
    OrderService.increaseGameStock(reserve.gameId)
  );
  
  await Promise.all(stockUpdates);
  
  console.log(`✅ Cancelled ${result.count} reserves and restored stock`);
  return;
};

OrderService.returnOrder = async (order) => {
  console.log('🔄 Returning order:', order.id);
  
  // Primeiro, buscar todas as reservas que serão devolvidas para atualizar o estoque
  const reservesToReturn = await prisma.reserve.findMany({
    where: {
      id: {
        startsWith: order.id
      },
      statusReserveId: ORDER_STATUS_ENUM.ORDERED
    },
    select: { id: true, gameId: true, statusReserveId: true }
  });
  
  console.log(`📦 Found ${reservesToReturn.length} reserves to return and restore stock`);
  
  // Atualizar status das reservas
  const result = await prisma.reserve.updateMany({
    where: {
      id: {
        startsWith: order.id
      },
      statusReserveId: ORDER_STATUS_ENUM.ORDERED
    },
    data: {
      statusReserveId: ORDER_STATUS_ENUM.RETURNED,
      returnDate: new Date(),
    },
  });
  
  // Devolver estoque para cada reserva devolvida
  const stockUpdates = reservesToReturn.map(reserve => 
    OrderService.increaseGameStock(reserve.gameId)
  );
  
  await Promise.all(stockUpdates);
  
  console.log(`✅ Returned ${result.count} reserves and restored stock`);
  return;
};

OrderService.adminCreate = async ({ id, userId, gameId, reserveDate }) => {
  // Gera um id se não vier
  const reserveId = id || nanoid(12);
  const reserve = await prisma.reserve.create({
    data: {
      id: reserveId,
      userId: Number(userId),
      gameId: Number(gameId),
      statusReserveId: ORDER_STATUS_ENUM.PENDING,
      reserveDate: new Date(reserveDate),
    },
  });
  return reserve;
};

OrderService.adminUpdate = async ({
  id,
  userId,
  gameId,
  statusReserveId,
  reserveDate,
  approveDate,
  returnDate,
}) => {
  // Buscar o status atual da reserva para determinar se precisamos alterar o estoque
  const currentReserve = await prisma.reserve.findUnique({
    where: {
      id_userId_gameId: {
        id,
        userId: Number(userId),
        gameId: Number(gameId),
      },
    },
    select: { statusReserveId: true, gameId: true }
  });

  if (!currentReserve) {
    throw new Error('Reserve not found');
  }

  const oldStatus = currentReserve.statusReserveId;
  const newStatus = Number(statusReserveId);
  
  console.log(`🔄 Admin updating reserve ${id}: ${oldStatus} → ${newStatus}`);

  let data = {};

  if (statusReserveId && newStatus == ORDER_STATUS_ENUM.PENDING) {
    data = {
      statusReserveId: ORDER_STATUS_ENUM.PENDING,
      reserveDate: reserveDate ? new Date(reserveDate) : undefined,
      approveDate: null,
      returnDate: null,
    };
  } else if (
    statusReserveId &&
    (newStatus == ORDER_STATUS_ENUM.CANCELLED || 
    newStatus == ORDER_STATUS_ENUM.RETURNED)
  ) {
    data = {
      statusReserveId: newStatus,
      reserveDate: reserveDate ? new Date(reserveDate) : undefined,
      approveDate: approveDate ? new Date(approveDate) : undefined,
      returnDate: returnDate ? new Date(returnDate) : undefined,
    };
  } else if (
    statusReserveId &&
    newStatus == ORDER_STATUS_ENUM.ORDERED
  ) {
    data = {
      statusReserveId: ORDER_STATUS_ENUM.ORDERED,
      reserveDate: reserveDate ? new Date(reserveDate) : undefined,
      approveDate: approveDate ? new Date(approveDate) : undefined,
      returnDate: null,
    };
  }

  // Atualizar a reserva
  const reserve = await prisma.reserve.update({
    where: {
      id_userId_gameId: {
        id,
        userId: Number(userId),
        gameId: Number(gameId),
      },
    },
    data,
  });

  // Gerenciar estoque baseado na mudança de status
  if (oldStatus !== newStatus) {
    await OrderService.handleStockChangeForStatusUpdate(gameId, oldStatus, newStatus);
  }

  return reserve;
};

OrderService.adminDelete = async ({ id, userId, gameId }) => {
  // Buscar o status atual da reserva para determinar se precisamos devolver estoque
  const currentReserve = await prisma.reserve.findUnique({
    where: {
      id_userId_gameId: {
        id,
        userId: Number(userId),
        gameId: Number(gameId),
      },
    },
    select: { statusReserveId: true, gameId: true }
  });

  if (!currentReserve) {
    throw new Error('Reserve not found');
  }

  // Deletar a reserva
  await prisma.reserve.delete({
    where: {
      id_userId_gameId: {
        id,
        userId: Number(userId),
        gameId: Number(gameId),
      },
    },
  });

  // Se a reserva estava consumindo estoque, devolver ao estoque
  const stockConsumingStatuses = [ORDER_STATUS_ENUM.PENDING, ORDER_STATUS_ENUM.ORDERED];
  if (stockConsumingStatuses.includes(currentReserve.statusReserveId)) {
    console.log(`📈 Restoring stock for deleted reserve ${id} (game ${gameId})`);
    await OrderService.increaseGameStock(Number(gameId));
  }

  console.log(`🗑️ Deleted reserve ${id} and handled stock appropriately`);
};

export default OrderService;
