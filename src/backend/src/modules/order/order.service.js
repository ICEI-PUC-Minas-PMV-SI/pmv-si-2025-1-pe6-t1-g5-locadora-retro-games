import express from 'express';
import prisma from '../../infra/prisma/prisma.js';

const OrderService = {};

OrderService.getOrdersFromUser = async (userId) => {
    const userOrders = await prisma.reserve.findUnique({
        where: { id: Number(userId) }
    });

    return userOrders;
}

export default OrderService;