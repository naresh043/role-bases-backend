const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://NamasteNaresh:Naresh%40143@namastenaresh.qddqpyv.mongodb.net/InventoryOrderManagementSystem"
    );
    console.log("MongoDB Connected");
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
