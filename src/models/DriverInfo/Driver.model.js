const mongoose = require("mongoose");

const DriverSchema = mongoose.Schema(
  {
    driverId: {
      type: String,
      required: true,
      unique: true,
    },
    driverName: {
      type: String,
      required: true,
    },
    driverEmail: {
      type: String,
      default: null,
    },
    driverPhone: {
      type: String,
      required: true,
    },
    driverAddress: {
      type: String,
      default: null,
    },
    driverBirth: {
      type: Date,
      default: null,
    },
    driverCCCD: {
      type: String,
      default: null,
    },
    driverCCCDDate: {
      type: Date,
      default: null,
    },
    driverLicenseId: {
      type: String,
      default: null,
    },
    driverLicenseType: {
      type: String,
      default: null,
    },
    driverVehicleBSX: {
      // Tham chiếu đến biển số xe trong DB Vehicle
      type: String,
      default: null,
    },
    driverGender: {
      type: Number,
      required: true,
      default: 0, // 0: Male, 1: Female
    },
    driverStatus: {
      type: Boolean,
      default: false,
    },
    driverViolation: {
      type: Number,
      default: 0,
    },
    driverNationality: {
      type: String,
      required: true,
      default: "Việt Nam",
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    collection: "Driver",
  }
);
// DriverSchema.index(
//   { driverEmail: 1 },
//   { unique: true, partialFilterExpression: { driverEmail: { $ne: null } } }
// );
// DriverSchema.index(
//   { driverCCCD: 1 },
//   { unique: true, partialFilterExpression: { driverCCCD: { $ne: null } } }
// );
// DriverSchema.index(
//   { driverLicenseId: 1 },
//   { unique: true, partialFilterExpression: { driverLicenseId: { $ne: null } } }
// );
// DriverSchema.index(
//   { driverVehicleBSX: 1 },
//   { unique: true, partialFilterExpression: { driverVehicleBSX: { $ne: null } } }
// );

const Driver = mongoose.model("Driver", DriverSchema);

module.exports = Driver;
