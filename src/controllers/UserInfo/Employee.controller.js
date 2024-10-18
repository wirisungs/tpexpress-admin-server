const Employee = require("../../models/UserInfo/Employee.model");
const Role = require("../../models/UserInfo/Role.model");

const EmployeeController = {
  // Thêm nhân viên
  addEmployee: async (req, res) => {
    try {
      // Kiểm tra roleID
      const { employeeID, employeeName, role } = req.body;
      const checkRole = await Role.findOne({ roleID: role });
      if (!checkRole) {
        return res.status(400).json("Role không tồn tại");
      }
      // console.log(checkRole);
      const newEmployee = new Employee({
        employeeID,
        employeeName,
        role: checkRole._id,
      });
      await newEmployee.save();

      return res.status(201).json({
        message: "Nhân viên đã được tạo thành công",
        employee: newEmployee,
      });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },
};

module.exports = EmployeeController;
