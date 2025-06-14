import express from "express";
import AsaasService from "./asaas.service.js";
import OrderService from "./order.service.js";

const OrderController = {};

OrderController.getOrders = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const offset = (page - 1) * limit;
    const field = req.query?.field || "name";
    const order = req.query?.order || "asc";
    const search = req.query?.search;
    const { reserves, total, pendingCount, totalOverdueCount } =  await OrderService.list(
      limit,
      offset,
      field,
      order,
      search
    );
    res.status(200).json({
      orders: reserves,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: limit,
      totalPeding: pendingCount,
      totalOverdue: totalOverdueCount,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
};

OrderController.getOrdersByUserId = async (req, res) => {
  try {
    let data;
    data = await OrderService.getOrdersFromUser(req.userData.id);
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
};

OrderController.insertOrder = async (req, res) => {
  console.log('🚀 POST /orders called by user:', req.userData?.id);
  console.log('📦 Request body:', req.body);
  
  if (!req.userData.id || !req.body.gameList) {
    console.log('❌ Invalid request - missing userData.id or gameList');
    res.status(400).json({ error: "Bad Request", message: "userId and gameList are required" });
    return;
  }
  
  console.log('✅ Valid request - proceeding with order creation');
  
  try {
    const params = {
      userId: req.userData.id,
      gameList: req.body.gameList,
    };
    const orderId = await OrderService.insertOrder(params);
    console.log('🎉 Order created successfully:', orderId);
    res.status(200).json({ success: true, orderId: orderId });
  } catch (error) {
    console.log('❌ Error creating order:', error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
};

OrderController.checkout = async (req, res) => {
  const { holderName, number, expiryMonth, expiryYear, ccv, value } = req.body;
  if (!holderName || !number || !expiryMonth || !expiryYear || !ccv || !value) {
    res.status(400).json({ 
      error: "Bad Request", 
      message: "All payment fields are required: holderName, number, expiryMonth, expiryYear, ccv, value" 
    });
    return;
  }
  
  if (!req.params.id) {
    res.status(400).json({ error: "Bad Request", message: "Order ID is required" });
    return;
  }

  try {
    const customer = await OrderService.getCustomerData(req.userData.id);
    if (!customer) {
      res.status(401).json({ error: "Unauthorized", message: "Customer data not found" });
      return;
    }
    
    const customerId = await AsaasService.getCustomerId(customer);
    if (!customerId) {
      res.status(500).json({ error: "Internal Server Error", message: "Failed to get customer ID from payment service" });
      return;
    }
    
    const params = {
      holderName,
      number,
      expiryMonth,
      expiryYear,
      ccv,
    };
    
    const isConfirmed = await OrderService.checkout(
      params,
      value,
      { ...customer, customerId },
      { id: req.params.id, user: req.userData.id }
    );
    
    if (isConfirmed) {
      res.status(200).json({ 
        success: true, 
        message: `Pagamento efetuado para reserva ${req.params.id}`,
        orderId: req.params.id 
      });
    } else {
      res.status(500).json({ error: "Payment Failed", message: "Payment could not be processed" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
};

OrderController.cancelOrder = async (req, res) => {
  const params = { id: req.params.id };
  try {
    if (!params.id) {
      res.status(400).json("Bad Request");
      return;
    }
    await OrderService.cancelOrder(params);
    res.status(200).json("Ok");
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
};

OrderController.adminCreate = async (req, res) => {
  try {
    const { id, userId, gameId, statusReserveId, reserveDate } = req.body;
    if (!userId || !gameId || !statusReserveId || !reserveDate) {
      return res.status(400).json("Missing required fields");
    }
    const reserve = await OrderService.adminCreate({
      id,
      userId,
      gameId,
      reserveDate,
    });
    res.status(200).json(reserve);
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
};

OrderController.adminUpdate = async (req, res) => {
  try {
    const { id, userId, gameId, statusReserveId, reserveDate, approveDate, returnDate } = req.body;
    if (!id || !userId || !gameId) {
      return res.status(400).json("Missing required fields");
    }
    const reserve = await OrderService.adminUpdate({
      id,
      userId,
      gameId,
      statusReserveId,
      reserveDate,
      approveDate,
      returnDate,
    });
    res.status(200).json(reserve);
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
};

OrderController.adminDelete = async (req, res) => {
  try {
    const { id, userId, gameId } = req.body;
    if (!id || !userId || !gameId) {
      return res.status(400).json("Missing required fields");
    }
    await OrderService.adminDelete({ id, userId, gameId });
    res.status(200).json("Reserva excluída com sucesso");
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
};

export default OrderController;
