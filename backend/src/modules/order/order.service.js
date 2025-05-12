import prisma from "../../infra/prisma/prisma.js";
import { nanoid } from "nanoid";
import AsaasService from "./asaas.service.js";
import ORDER_STATUS_ENUM from "../../utils/orderStatus.enum.js";

const OrderService = {};

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
  const userOrders = await prisma.reserve.findMany({
    where: { userId: Number(userId) },
  });
  return userOrders;
};

OrderService.insertOrder = async ({ userId, gameList }) => {
  const orderId = nanoid(12);
  await Promise.all(
    gameList.map((gameId) =>
      prisma.reserve.create({
        data: {
          id: orderId,
          userId: Number(userId),
          gameId: Number(gameId),
          statusReserveId: ORDER_STATUS_ENUM.PENDING,
          reserveDate: new Date(),
        },
      })
    )
  );

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
  await prisma.reserve.updateMany({
    where: {
      id: order.id,
      userId: Number(order.user),
    },
    data: {
      statusReserveId: ORDER_STATUS_ENUM.ORDERED,
      approveDate: new Date(),
      returnDate: new Date(new Date().setDate(new Date().getDate() + 15)),
    },
  });
  return true;
};

OrderService.cancelOrder = async (order) => {
  await prisma.reserve.updateMany({
    where: {
      id: order.id,
    },
    data: {
      statusReserveId: ORDER_STATUS_ENUM.CANCELLED,
    },
  });
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
  let data = {};

  if (statusReserveId && Number(statusReserveId) == ORDER_STATUS_ENUM.PENDING) {
    data = {
      statusReserveId: ORDER_STATUS_ENUM.PENDING,
      reserveDate: reserveDate ? new Date(reserveDate) : undefined,
      approveDate: null,
      returnDate: null,
    };
  } else if (
    statusReserveId &&
    (Number(statusReserveId) == ORDER_STATUS_ENUM.CANCELLED || 
    Number(statusReserveId) == ORDER_STATUS_ENUM.RETURNED)
  ) {
    data = {
      statusReserveId: Number(statusReserveId),
      reserveDate: reserveDate ? new Date(reserveDate) : undefined,
      approveDate: approveDate ? new Date(approveDate) : undefined,
      returnDate: returnDate ? new Date(returnDate) : undefined,
    };
  } else if (
    statusReserveId &&
    Number(statusReserveId) == ORDER_STATUS_ENUM.ORDERED
  ) {
    data = {
      statusReserveId: ORDER_STATUS_ENUM.ORDERED,
      reserveDate: reserveDate ? new Date(reserveDate) : undefined,
      approveDate: approveDate ? new Date(approveDate) : undefined,
      returnDate: null,
    };
  }

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
  return reserve;
};

OrderService.adminDelete = async ({ id, userId, gameId }) => {
  await prisma.reserve.delete({
    where: {
      id_userId_gameId: {
        id,
        userId: Number(userId),
        gameId: Number(gameId),
      },
    },
  });
};

export default OrderService;
