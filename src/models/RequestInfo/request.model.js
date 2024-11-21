const mongoose = require("mongoose");

const RequestSchema = mongoose.Schema(
  {
    Request_ID: {
      type: String,
      unique: true,
    },
    Cus_ID: {
      type: String,
      required: true,
    },
    Order_ID: {
      type: String,
      required: true,
    },
    Driver_ID: {
      type: String,
      default: null,
    },
    Request_Picture: {
      type: String,
      required: true,
    },
    Request_Status: {
      type: String,
      required: true,
    },
    Request_Date: {
      type: String,
    },

    Request_Type: {
      type: String,
      enum: ["HBV", "HBL", "HCVC", "CNT"], // HBV: Hàng bị vỡ, HBL: Hàng bị lạc, HCG: Hàng chưa giao, CNT: "Chưa nhận tiền"
    },
  },
  {
    collection: "Request",
  }
);
const Request = mongoose.model("Request", RequestSchema);

module.exports = Request;
