const mongoose = require("mongoose");

const EmployeeSchema = mongoose.Schema(
  {
    employeeID: {
      type: String,
      required: true,
      unique: true,
    },
    employeeName: {
      type: String,
      required: true,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
  },
  { collection: "Employee" }
);

const Employee = mongoose.model("Employee", EmployeeSchema);

module.exports = Employee;
