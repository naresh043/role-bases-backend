const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

const getAdminDashboardData = async () => {
  const totalUsers = await User.countDocuments({ isActive: true });
  const totalProducts = await Product.countDocuments({ isActive: true });
  const totalOrders = await Order.countDocuments();

  const lowStockProducts = await Product.find({
    isActive: true,
    $expr: {
      $lt: ["$stockQuantity", "$reorderLevel"],
    },
  })
    .select("name stockQuantity reorderLevel")
    .sort({ stockQuantity: 1 })
    .limit(5);

  const lowStockCount = lowStockProducts.length;

  // Recent orders (last 5)
  const recentOrders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select("orderNumber status totalAmount createdAt");

  return {
    totalUsers,
    totalProducts,
    totalOrders,
    lowStockCount,
    recentOrders,
    lowStockProducts,
  };
};

module.exports = {
  getAdminDashboardData,
};
