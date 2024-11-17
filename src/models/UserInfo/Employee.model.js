const mongoose = require("mongoose");

const EmployeeSchema = mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: true,
      unique: true,
    },
    employeeName: {
      type: String,
      required: true,
    },
    employeeEmail: {
      type: String,
      default: null,
    },
    employeePhone: {
      type: String,
      default: null,
    },
    userStatus: {
      type: String,
      required: true,
      default: "deactive",
    },
    userId: {
      type: String,
      required: true,
    },
  },
  { collection: "Employee" }
);

const Employee = mongoose.model("Employee", EmployeeSchema);

module.exports = Employee;
