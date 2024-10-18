const mongoose = require("mongoose");

const CustomerSchema = mongoose.Schema(
  {
    cus_ID: {
      type: String,
      required: true,
      unique: true,
    },
    cus_Name: {
      type: String,
      required: true,
    },
    cus_Email: {
      type: String,
      required: true,
    },
    cus_Phone: {
      type: String,
      required: true,
    },
    cus_Address: {
      type: String,
      required: true,
    },
    cus_Birthday: {
      type: String,
      required: true,
    },
    cus_Gender: {
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
