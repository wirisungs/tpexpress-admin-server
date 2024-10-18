const User = require("../../models/UserInfo/User.model");
const Role = require("../../models/UserInfo/Role.model");
const Employee = require("../../models/UserInfo/Employee.model");

const UserController = {
  // Tạo user account
  addUser: async (req, res) => {
    try {
      const { phonenumber, password, employee } = req.body;

      const checkEmployee = await Employee.findOne({ employeeID: employee });
      if (!checkEmployee) {
        // Nếu không có nhân viên
        return res.status(400).json({ message: "Nhân viên không tồn tại!" });
      }
      console.log(checkEmployee);
      const newUser = new User({
        phonenumber,
        password,
        employee: checkEmployee._id,
      });
      await newUser.save();
      return res.status(200).json({ message: "Tạo tài khoản thành công!" });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },

  // Xem thông tin user
  getAnUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id)
        .populate({
          path: "employee",
          populate: {
            path: "role",
          },
        })
        .exec(); // Liên kết các bảng đã tham chiếu
      if (!user) {
        return res.status(400).json({ Message: "Tài khoản không tồn tại" });
      }
      return res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error.message);
    }
  },
};

module.exports = UserController;
