import express from 'express';
import OrderController from './order.controller.js';

const OrderRouter = express.Router();

// Define your routes here
OrderRouter.get('/', OrderController.getOrdersFromUser);
OrderRouter.get('/:id', OrderController.getOrdersFromUser)
OrderRouter.post('/', OrderController.insertOrder);
OrderRouter.post('/checkout', OrderController.checkout)

export default OrderRouter;