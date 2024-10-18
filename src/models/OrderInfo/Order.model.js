const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema(
  {
    Order_ID: {
      type: String,
      required: true,
      unique: true,
    },
    Receiver_Phone: {
      type: String,
      required: true,
    },
    Receiver_Name: {
      type: String,
      required: true,
    },
    Receiver_Address: {
      type: String,
      required: true,
    },
    Order_Note: {
      type: String,
    },
    Order_COD: {
      type: Number,
      required: true,
    },
    Order_TotalPrice: {
      type: Number,
      required: true,
    },
    Order_Type: {
      type: String,
      enum: ["Nội thành", "Ngoại thành"], // Giới hạn loại đơn hàng
      required: true,
    },
    Order_Status: {
      type: String,
      enum: ["Đã hủy", "Đang giao", "Đã giao"], // Giới hạn trạng thái đơn hàng
      required: true,
    },
    Services_ID: {
      type: String,
      required: true,
    },
    Voucher_ID: {
      type: String,
    },
    Payment_ID: {
      type: String,
      required: true,
    },
    Cus_ID: {
      type: String,
      required: true,
    },
    Driver_ID: {
      type: String,
      required: true,
    },
  },
  {
    collection: "Order",
  }
);
const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
