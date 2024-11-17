const mongoose = require("mongoose");

const CustomerSchema = mongoose.Schema(
  {
    cusId: {
      type: String,
      unique: true,
    },
    cusName: {
      type: String,
      required: true,
    },
    cusEmail: {
      type: String,
      required: true,
      unique: true,
    },
    cusPhone: {
      type: String,
      required: true,
      unique: true,
    },
    cusAddress: {
      type: String,
      required: true,
    },
    cusBirthday: {
      type: String,
      required: true,
    },
    cusGender: {
      type: Number,
      required: true,
      default: 0, // 0: Male, 1: Female
    },
  },
  {
    collection: "Customer",
  }
);

const Customer = mongoose.model("Customer", CustomerSchema);

module.exports = Customer;
