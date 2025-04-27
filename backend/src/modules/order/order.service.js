import express from "express";
import prisma from "../../infra/prisma/prisma.js";
import { nanoid } from "nanoid";
import AsaasService from "./asaas.service.js";

const OrderService = {};

OrderService.list = async (limit, offset) => {
  const [reserves, total] = await Promise.all([
    prisma.reserve.findMany({
      take: limit,
      skip: offset,
    }),
    prisma.console.count()
  ]);
  return { reserves, total };
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
          statusReserveId: 4,
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
      statusReserveId: 1,
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
      statusReserveId: 3,
    },
  });
  return;
};

OrderService.adminCreate = async ({ id, userId, gameId, statusReserveId, reserveDate, approveDate, returnDate }) => {
  // Gera um id se não vier
  const reserveId = id || nanoid(12);
  const reserve = await prisma.reserve.create({
    data: {
      id: reserveId,
      userId: Number(userId),
      gameId: Number(gameId),
      statusReserveId: Number(statusReserveId),
      reserveDate: new Date(reserveDate),
      approveDate: approveDate ? new Date(approveDate) : null,
      returnDate: returnDate ? new Date(returnDate) : null,
    },
  });
  return reserve;
};

OrderService.adminUpdate = async ({ id, userId, gameId, statusReserveId, reserveDate, approveDate, returnDate }) => {
  const reserve = await prisma.reserve.update({
    where: {
      id_userId_gameId: {
        id,
        userId: Number(userId),
        gameId: Number(gameId),
      },
    },
    data: {
      statusReserveId: statusReserveId ? Number(statusReserveId) : undefined,
      reserveDate: reserveDate ? new Date(reserveDate) : undefined,
      approveDate: approveDate ? new Date(approveDate) : undefined,
      returnDate: returnDate ? new Date(returnDate) : undefined,
    },
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
