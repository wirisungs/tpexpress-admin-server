const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
    },
    dservicesId: {
      type: String,
      required: true,
    },
    paymentId: {
      type: String,
      required: true,
      default: "P001",
    },
    cusId: {
      type: String,
      required: true,
    },
    driverId: {
      type: String,
      default: "",
    },
    orderStatusId: {
      type: String,
      default: "ST001",
      required: true,
    },
    senderAddress: {
      type: String,
      required: true,
    },
    receiverPhone: {
      type: String,
      required: true,
    },
    receiverName: {
      type: String,
      required: true,
    },
    receiverAddress: {
      type: String,
      required: true,
    },
    createdDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    orderIsFragile: {
      type: Boolean,
      default: false,
    },
    orderNote: {
      type: String,
    },
    orderCOD: {
      type: Number,
      default: 0,
    },
    deliverPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    orderType: {
      type: String,
      enum: ["Nội thành", "Ngoại thành"], // Giới hạn loại đơn hàng
      required: true,
    },
    proofSuccess: {
      type: String,
      default: "",
    },
    reasonFailed: {
      type: String,
      default: "",
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    collection: "Order",
  }
);
const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
