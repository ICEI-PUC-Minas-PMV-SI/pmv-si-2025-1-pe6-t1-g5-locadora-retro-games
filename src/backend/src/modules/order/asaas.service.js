const AsaasService = {}

AsaasService.getCustomerId = async (customer) => {
    const url = `https://api-sandbox.asaas.com/v3/customers?cpfCnpj=${customer.cpf}`
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            accept: 'application/json',
            access_token: '1234'
        }
    });

    if(!response.totalCount) return AsaasService.createCustomerId(customer);
    else return response.data[0].id;
}

AsaasService.createCustomerId = async (customer) => {
    const url = `https://api-sandbox.asaas.com/v3/customers`
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            accept: 'application/json',
            access_token: '1234'
        },
        body: {
            name: customer.name,
            cpfCnpj: customer.cpf,
        }
    });

    return response.id;
}

export default AsaasService;