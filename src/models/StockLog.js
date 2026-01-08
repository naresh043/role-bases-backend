const mongoose = require("mongoose");

const stockLogSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    productName: {
      type: String, // denormalized for history
      required: true,
      trim: true,
    },

    changeType: {
      type: String,
      enum: ["restock", "sale", "adjustment", "damage", "return"],
      required: true,
    },

    quantityBefore: {
      type: Number,
      required: true,
      min: 0,
    },

    quantityChanged: {
      type: Number,
      required: true, // +ve for increase, -ve for decrease
    },

    quantityAfter: {
      type: Number,
      required: true,
      min: 0,
    },

    reason: {
      type: String,
      trim: true,
    },

    relatedOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },

    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // creates createdAt & updatedAt
  }
);

/* 🔹 Indexes */
stockLogSchema.index({ product: 1, createdAt: -1 });
stockLogSchema.index({ performedBy: 1 });
stockLogSchema.index({ changeType: 1 });

module.exports = mongoose.model("StockLog", stockLogSchema);
