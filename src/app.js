const express = require("express");
require("dotenv").config();
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", require("./routes/authRoutes"));
app.use("/api/v1/users", require("./routes/userRoutes"));
app.use("/api/v1/products", require("./routes/productRoutes"));
app.use("/api/v1/stock", require("./routes/stockRoutes"));
app.use("/api/v1/orders", require("./routes/orderRoute"));
app.use("/api/v1/dashboard", require("./routes/dashboardRoutes"))
app.use("/api/v1/ai", require("./routes/aiRoutes"));


module.exports = app;
