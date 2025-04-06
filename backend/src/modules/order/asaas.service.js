import { json } from "express";

const AsaasService = {}
const API_KEY = process.env.API_KEY

AsaasService.getCustomerId = async (customer) => {
    const url = `https://api-sandbox.asaas.com/v3/customers?cpfCnpj=${customer.cpf}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            accept: 'application/json',
            access_token: API_KEY
        }
    });
    const responseBody = await response.json();
    if(!responseBody.totalCount) return AsaasService.createCustomerId(customer);
    else return responseBody.data[0].id;
}

AsaasService.createCustomerId = async (customer) => {
    const url = `https://api-sandbox.asaas.com/v3/customers`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            accept: 'application/json',
            access_token: API_KEY
        },
        body: JSON.stringify({
            name: customer.name,
            cpfCnpj: customer.cpf,
        })
    });
    const responseBody = await response.json();
    return responseBody.id;
}

AsaasService.payment = async (cardInfo, customer, value) => {
    const url = `https://api-sandbox.asaas.com/v3/payments`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            accept: 'application/json',
            access_token: API_KEY
        },
        body: JSON.stringify({
            customer: customer.customerId,
            billingType: 'CREDIT_CARD',
            dueDate: new Date().toISOString().split('T')[0],
            value: value,
            creditCard: {
                holderName: cardInfo.holderName,
                number: cardInfo.number,
                expiryMonth: cardInfo.expiryMonth,
                expiryYear: cardInfo.expiryYear,
                ccv: cardInfo.ccv,
            },
            creditCardHolderInfo: {
                name: cardInfo.holderName,
                email: customer.email,
                cpfCnpj: customer.cpf,
                postalCode: '31270650',
                addressNumber: '100',
                phone: '31995494101',
            }
        })
    });
    const responseBody = await response.json();
    return responseBody.id;
}

export default AsaasService;