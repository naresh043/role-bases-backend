const productService = require("../services/productService");
const { successResponse, errorResponse } = require("../utils/response");

const createProduct = async (req, res) => {
  try {
    const product = await productService.createProduct(req.body, req.user);
    return successResponse({
      res,
      message: "Product created successfully",
      data: product,
      statusCode: 201,
    });
  } catch (error) {
    return errorResponse({ res, message: error.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await productService.getProducts({ page, limit });

    return successResponse({
      res,
      message: "Products fetched successfully",
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    return errorResponse({ res, message: error.message });
  }
};



const getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    return successResponse({
      res,
      message: "Product fetched successfully",
      data: product,
    });
  } catch (error) {
    return errorResponse({
      res,
      message: error.message,
      statusCode: 404,
      code: "NOT_FOUND",
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await productService.updateProduct(
      req.params.id,
      req.body,
      req.user
    );
    return successResponse({
      res,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    return errorResponse({ res, message: error.message });
  }
};


const deleteProduct = async (req, res) => {
  try {
    await productService.deleteProduct(req.params.id);
    return successResponse({
      res,
      message: "Product deactivated successfully",
    });
  } catch (error) {
    return errorResponse({ res, message: error.message });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
