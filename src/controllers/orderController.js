const Order = require("../models/Order");
const Product = require("../models/Product");
const stockService = require("../services/stockService");
const { successResponse, errorResponse } = require("../utils/response");

/* =========================
   CREATE ORDER
========================= */
const createOrder = async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, items, notes } = req.body;

    if (!items || items.length === 0) {
      return errorResponse({
        res,
        message: "Order must contain at least one item",
        statusCode: 400,
      });
    }

    let totalAmount = 0;
    const orderItems = [];

    // 1️⃣ Validate products & calculate totals
    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product || !product.isActive) {
        return errorResponse({
          res,
          message: "Product not found or inactive",
          statusCode: 404,
        });
      }

      if (product.stockQuantity < item.quantity) {
        return errorResponse({
          res,
          message: `Insufficient stock for product ${product.name}`,
          statusCode: 400,
        });
      }

      const subtotal = item.quantity * product.price;
      totalAmount += subtotal;

      orderItems.push({
        product: product._id,
        productName: product.name,
        quantity: item.quantity,
        priceAtOrder: product.price,
        subtotal,
      });
    }

    // 2️⃣ Create order
    const order = await Order.create({
      orderNumber: `ORD-${Date.now()}`,
      customerName,
      customerEmail,
      customerPhone,
      items: orderItems,
      totalAmount,
      notes,
      createdBy: req.user._id,
    });

    // 3️⃣ Decrement stock & create stock logs
    try {
      for (const item of orderItems) {
        await stockService.updateStock(
          {
            productId: item.product,
            quantityChanged: -item.quantity, // 🔥 DECREMENT
            changeType: "sale",
            relatedOrder: order._id,
            reason: "Order placed",
          },
          req.user
        );
      }
    } catch (stockError) {
      // 4️⃣ Rollback order if stock update fails
      await Order.findByIdAndDelete(order._id);
      throw stockError;
    }

    return successResponse({
      res,
      message: "Order created successfully",
      data: order,
      statusCode: 201,
    });
  } catch (error) {
    return errorResponse({
      res,
      message: error.message,
    });
  }
};


/* =========================
   GET ALL ORDERS
========================= */
const getOrders = async (req, res) => {
  try {
    const query = {};

    // Sales → only their orders
    if (req.user.role === "sales") {
      query.createdBy = req.user._id;
    }

    const orders = await Order.find(query)
      .populate("createdBy", "name email role")
      .sort({ orderDate: -1 });

    return successResponse({
      res,
      message: "Orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    return errorResponse({
      res,
      message: error.message,
    });
  }
};

/* =========================
   GET ORDER BY ID
========================= */
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("createdBy", "name email role");

    if (!order) {
      return errorResponse({
        res,
        message: "Order not found",
        statusCode: 404,
      });
    }

    // Sales can only access their orders
    if (
      req.user.role === "sales" &&
      order.createdBy._id.toString() !== req.user._id.toString()
    ) {
      return errorResponse({
        res,
        message: "Access denied",
        statusCode: 403,
      });
    }

    return successResponse({
      res,
      message: "Order fetched successfully",
      data: order,
    });
  } catch (error) {
    return errorResponse({
      res,
      message: error.message,
    });
  }
};

/* =========================
   UPDATE ORDER STATUS
========================= */
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return errorResponse({
        res,
        message: "Invalid order status",
        statusCode: 400,
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return errorResponse({
        res,
        message: "Order not found",
        statusCode: 404,
      });
    }

    order.status = status;
    order.updatedBy = req.user._id;
    await order.save();

    return successResponse({
      res,
      message: "Order status updated successfully",
      data: {
        id: order._id,
        status: order.status,
      },
    });
  } catch (error) {
    return errorResponse({
      res,
      message: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
};
