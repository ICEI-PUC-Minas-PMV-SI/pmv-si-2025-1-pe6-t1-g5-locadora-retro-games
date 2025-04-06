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

export default OrderService;
