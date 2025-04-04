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
    // recebo id do cliente e array de produtos, para cada um na lista
    // registro order com id + 
    try {
        const params = {
            userId: req.headers.id,
            gameList: req.body.gameList,
        };

        await OrderService.insertOrder(params);
        res.status(200).json(true);
    } catch(error) {
        console.log(error);
        res.status(500).json("Internal Server Error");
    }
    // buscar cliente
    // caso não haja, criar cliente
    // gerar cobranca cartao
    // callback confirm
    // status: pendente > confirmado
    // insertOrder; checkoutOrder; confirmOrder; cancelOrder; editOrder (pendente only)
}

OrderController.checkout = async (req, res) => {
    const {
        holderName,
        number,
        expiryMonth,
        expiryYear,
        ccv
    } = req.body;

    try {
        const customer = await OrderService.getCustomerData(req.headers.token);

        if(!customer) res.status(401).json("Por favor, tente novamente mais tarde");

        const customerId = await AsaasService.getCustomerId(customer);

        if(!customerId) res.status(500).json('Internal Server Error');


        const params = {
            holderName,
            number,
            expiryMonth,
            expiryYear,
            ccv,
        };

        await OrderService.checkout(params);
        await OrderService.confirm(req.params.id);
        res.status(200).json(true);
    } catch(error) {
        console.log(error);
        res.status(500).json("Internal Server Error");
    }
}

OrderController.deleteOrder = async (req, res) => {
    // cancela pedido feito pelo cliente
    // remover registro ou manter protocolo?
}

export default OrderController;