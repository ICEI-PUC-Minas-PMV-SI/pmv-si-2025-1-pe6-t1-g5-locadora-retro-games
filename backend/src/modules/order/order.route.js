import express from 'express';
import OrderController from './order.controller.js';
import authMiddleware from '../../middleware/auth.middleware.js';
import isAdmin from '../../middleware/isAdminAuthorization.middleware.js';
import userAuthorization from '../../middleware/userAuthorization.middleware.js';

const OrderRouter = express.Router();

// Define your routes here

OrderRouter.get('/', authMiddleware, isAdmin, OrderController.getOrders);
OrderRouter.get('/user', authMiddleware, OrderController.getOrdersByUserId);
OrderRouter.post('/', authMiddleware, OrderController.insertOrder);
OrderRouter.post('/checkout/:id', authMiddleware, OrderController.checkout);
OrderRouter.delete('/:id', authMiddleware, isAdmin, OrderController.cancelOrder);
OrderRouter.delete('/user/:id', authMiddleware, userAuthorization, OrderController.cancelOrder);

export default OrderRouter;