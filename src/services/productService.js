const Product = require("../models/Product");

const createProduct = async (data, user) => {
  const product = await Product.create({
    ...data,
    createdBy: user._id,
  });
  return product;
};

/* ================= PAGINATED PRODUCTS ================= */
const getProducts = async ({ page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;

  const filter = { isActive: true };

  const [products, total] = await Promise.all([
    Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    Product.countDocuments(filter),
  ]);

  return {
    data: products,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getProductById = async (id) => {
  const product = await Product.findById(id);
  if (!product || !product.isActive) {
    throw new Error("Product not found");
  }
  return product;
};

const updateProduct = async (id, data, user) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new Error("Product not found");
  }

  Object.assign(product, data);
  product.updatedBy = user._id;

  await product.save();
  return product;
};

const deleteProduct = async (id) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new Error("Product not found");
  }

  product.isActive = false;
  await product.save();
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
