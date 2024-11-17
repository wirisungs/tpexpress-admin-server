const mongoose = require("mongoose");

const DServiceSchema = mongoose.Schema(
  {
    servicesId: {
      type: String,
      required: true,
      unique: true,
    },
    servicesName: {
      type: String,
      required: true,
    },
    servicesPrice: {
      type: Number,
      required: true,
    },
  },
  {
    collection: "DeliveryServices",
  }
);
const DService = mongoose.model("DeliveryServices", DServiceSchema);

module.exports = DService;
