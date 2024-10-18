const mongoose = require("mongoose");

const DriverSchema = mongoose.Schema(
  {
    driver_ID: {
      type: String,
      required: true,
      unique: true,
    },
    driver_Name: {
      type: String,
      required: true,
    },
    driver_Email: {
      type: String,
      required: true,
    },
    driver_Phone: {
      type: String,
      required: true,
    },
    driver_Address: {
      type: String,
      required: true,
    },
    driver_Birthday: {
      type: String,
      required: true,
    },
    driver_NationalID: {
      type: String,
      required: true,
    },
    driver_DateIssue: {
      type: String,
      required: true,
    },
    driver_LicenseID: {
      type: String,
      required: true,
    },
    driver_LicenseType: {
      type: String,
      required: true,
    },
    driver_LicensePlate: {
      // Tham chiếu đến biển số xe trong DB Vehicle
      type: String,
      required: true,
    },
    driver_Gender: {
      type: Number,
      required: true,
      default: 0, // 0: Male, 1: Female
    },
    driver_Status: {
      type: Boolean,
      default: false,
    },
    driver_Violation: {
      type: Number,
      default: 0,
    },
    driver_Nationality: {
      type: String,
      required: true,
    },
  },
  {
    collection: "Driver",
  }
);

const Driver = mongoose.model("Driver", DriverSchema);

module.exports = Driver;
