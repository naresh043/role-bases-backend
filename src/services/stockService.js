const Product = require("../models/Product");
const StockLog = require("../models/StockLog");

const updateStock = async (data, user) => {
  const {
    productId,
    quantityChanged,
    changeType,
    reason,
    notes,
    relatedOrder,
  } = data;

  if (!productId || quantityChanged === undefined || !changeType) {
    throw new Error("productId, quantityChanged and changeType are required");
  }

  const product = await Product.findById(productId);

  if (!product || !product.isActive) {
    throw new Error("Product not found");
  }

  const quantityBefore = product.stockQuantity;
  const quantityAfter = quantityBefore + quantityChanged;

  if (quantityAfter < 0) {
    throw new Error("Stock cannot be negative");
  }

  // Update product stock
  product.stockQuantity = quantityAfter;
  product.updatedBy = user._id;
  await product.save();

  // Create stock log
  const log = await StockLog.create({
    product: product._id,
    productName: product.name,
    changeType,
    quantityBefore,
    quantityChanged,
    quantityAfter,
    reason,
    notes,
    relatedOrder,
    performedBy: user._id,
  });

  return {
    productId: product._id,
    productName: product.name,
    quantityBefore,
    quantityAfter,
    logId: log._id,
  };
};

const getStockLogs = async (query) => {
  const filter = {};

  if (query.productId) {
    filter.product = query.productId;
  }

  if (query.changeType) {
    filter.changeType = query.changeType;
  }

  return await StockLog.find(filter)
    .populate("performedBy", "name role")
    .sort({ createdAt: -1 });
};

module.exports = {
  updateStock,
  getStockLogs,
};
