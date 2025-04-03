import express from 'express';
import { verifyAdmin } from '../../Util.js';
import OrderService from './order.service.js';

const OrderController = {}

OrderController.getOrdersFromUser = async (req, res) => {
    try {
        let data;
        if(req.params.id && verifyAdmin(req)) {
            data = await OrderService.getOrdersFromUser(req.params.id);
        } else {
            data = await OrderService.getOrdersFromUser(req.headers.id);
        }
        res.status(200).json(data);
    } catch(error) {
        console.log(error);
        res.status(500).json('Internal Server Error');
    }
}

OrderController.insertOrder = async (req, res) => {
    // cria nova order a partir do carrinho
    // flag de pagamento
}

OrderController.deleteOrder = async (req, res) => {
    // cancela pedido feito pelo cliente
    // remover registro ou manter protocolo?
}

OrderController.confirmPayment = async (req, res) => {
    // atualiza registro virando flag de confirm
}

export default OrderController;