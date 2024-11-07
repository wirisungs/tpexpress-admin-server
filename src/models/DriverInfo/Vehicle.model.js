const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    vehicleLicenseBSX: {
      type: String,
      required: true,
      unique: true,
    },
    vehicleTypeId: {
      type: String,
      required: true,
    },
    vehicleBrand: {
      type: String,
      required: true,
    },
    vehicleManufacture: {
      type: Date,
      required: true,
    },
    vehicleColor: {
      type: String,
      required: true,
    },
    vehicleDisplacement: {
      type: String,
      required: true,
    },
  },
  {
    collection: "Vehicle",
  }
);

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

module.exports = Vehicle;
