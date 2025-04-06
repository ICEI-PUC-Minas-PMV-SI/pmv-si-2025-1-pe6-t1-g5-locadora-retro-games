import express from 'express';
import AsaasService from './asaas.service.js';
import OrderService from './order.service.js';

const OrderController = {}

OrderController.getOrdersFromUser = async (req, res) => {
    try {
        let data;
        
        if(!req.headers.id) {
            res.status(400).json('Bad Request');
            return;
        }

        data = await OrderService.getOrdersFromUser(req.headers.id);
        
        res.status(200).json(data);
    } catch(error) {
        console.log(error);
        res.status(500).json('Internal Server Error');
    }
}

OrderController.insertOrder = async (req, res) => {
    if(!req.headers.id || !req.body.gameList) {
        res.status(400).json('Bad Request')
        return;
    }

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
}

OrderController.checkout = async (req, res) => {
    const {
        holderName,
        number,
        expiryMonth,
        expiryYear,
        ccv,
        value
    } = req.body;

    if(!holderName || !number || !expiryMonth || !expiryYear || !ccv || !value) {
        res.status(400).json('Bad Request')
        return;
    }

    try {
        const customer = await OrderService.getCustomerData(req.headers.id);
        if(!customer){ 
            res.status(401).json("Por favor, tente novamente mais tarde");
            return;
        }

        const customerId = await AsaasService.getCustomerId(customer);
        
        if(!customerId) {
            res.status(500).json('Internal Server Error');
            return;
        }

        const params = {
            holderName,
            number,
            expiryMonth,
            expiryYear,
            ccv,
        };
        const isConfirmed = await OrderService.checkout(params, value, { ...customer, customerId }, { id: req.params.id, user: req.headers.id });

        if(isConfirmed) res.status(200).json(`Pagamento efetuado para reserva ${req.params.id}`);
        else res.status(500).json('Internal Server Error');
    } catch(error) {
        console.log(error);
        res.status(500).json("Internal Server Error");
    }
}

OrderController.cancelOrder = async (req, res) => {
    const params = {
        id: req.params.id,
        user: Number(req.headers.id),
    };

    try {
        if(!params.id || !params.user) {
            res.status(400).json('Bad Request');
            return;
        }

        await OrderService.cancelOrder(params);
        res.status(200).json('Ok');
    } catch(error) {
        console.log(error);
        res.status(500).json('Internal Server Error');
    }
}

export default OrderController;