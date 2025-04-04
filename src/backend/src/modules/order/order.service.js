import express from 'express';
import prisma from '../../infra/prisma/prisma.js';
import jwt from 'jsonwebtoken';

const OrderService = {};

OrderService.getOrdersFromUser = async (userId) => {
    const userOrders = await prisma.reserve.findUnique({
        where: { id: Number(userId) }
    });

    return userOrders;
}

OrderService.insertOrder = async ({ userId, gameList }) => {
    gameList.forEach(gameId => await prisma.reserve.create({
        data: {
            userId,
            gameId,
            statusReserveId: 4,
            reserveDate: new Date(),
        }
    }));

    return;
}

OrderService.checkout = async ({ holderName, number, expiryMonth, expiryYear, ccv }) => {

}

OrderService.getCustomerData = async (token) => {
    try {
        
    }
}

export default OrderService;