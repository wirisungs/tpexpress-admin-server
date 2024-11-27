const User = require("../../models/UserInfo/User.model");
const Role = require("../../models/UserInfo/Role.model");
const Employee = require("../../models/UserInfo/Employee.model");
const bcrypt = require("bcrypt");
const Driver = require("../../models/DriverInfo/Driver.model");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const employeeRoleList = ["Admin", "Saleman", "Support"];

const genarateUserID = async () => {
  let id;
  let isUnique = false;

  while (!isUnique) {
    const randomParts = Math.floor(10000000 + Math.random() * 90000000);
    id = `ND${randomParts}`;

    // Kiểm tra tồn tại
    const existingUser = await User.findOne({ userId: id });
    if (!existingUser) {
      isUnique = true;
    }
  }

  return id;
};

// Hàm kiểm tra regex số điện thoại Việt Nam
const regexPhoneNumber = (phoneNumber) => {
  const regexPhoneNumber = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;

  return phoneNumber.match(regexPhoneNumber) ? true : false;
};

// Hàm kiểm tra regex số Gmail
const regexGmail = (gmail) => {
  const regexGmail = /^[a-z0-9](\.?[a-z0-9]){5,}@g(oogle)?mail\.com$/i;

  return gmail.match(regexGmail) ? true : false;
};

// Hàm kiểm tra bảo mật cuẩ password
const checkPasswordStrong = (password) => {
  const regexPassword =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

  return password.match(regexPassword) ? true : false;
};

const genarateDriverID = async () => {
  let id;
  let isUnique = false;

  while (!isUnique) {
    const randomParts = Math.floor(10000000 + Math.random() * 90000000);
    id = `TX${randomParts}`;

    // Kiểm tra tồn tại
    const existingDriver = await Driver.findOne({ driverId: id });
    if (!existingDriver) {
      isUnique = true;
    }
  }
  return id;
};

const genarateEmployeeID = async () => {
  let id;
  let isUnique = false;

  while (!isUnique) {
    const randomParts = Math.floor(10000000 + Math.random() * 90000000);
    id = `TX${randomParts}`;

    // Kiểm tra tồn tại
    const existingDriver = await Driver.findOne({ driverId: id });
    if (!existingDriver) {
      isUnique = true;
    }
  }
  return id;
};

const UserController = {
  // Tạo user account
  addUser: async (req, res) => {
    try {
      const { userFullname, userPassword, userEmail, userPhone, userRole } =
        req.body;
      // Tạo Id user
      const userId = await genarateUserID();
      // Mã hóa password
      const hashedPassword = await bcrypt.hash(userPassword, 10);

      // Kiểm tra cấu trúc số điện thoại Việt nam
      const phoneExisted = await User.findOne({ userPhone: userPhone });
      if (!regexPhoneNumber(userPhone)) {
        return res.status(400).json({ message: "Số điện thoại không hợp lệ!" });
      }
      // Kiểm tra tồn tài số điện thoại
      if (phoneExisted) {
        return res.status(400).json({ message: "Số điện thoại đã tồn tại!" });
      }
      // Kiểm tra độ bảo mật của password
      if (!checkPasswordStrong(userPassword)) {
        return res.status(400).json({ message: "Mật khẩu chưa an toàn!" });
      }
      // Kiểm tra cấu trúc gmail
      if (!regexGmail(userEmail)) {
        return res.status(400).json({ message: "Email không hợp lệ!" });
      }

      const newUser = new User({
        userId: userId,
        userPhone: userPhone,
        userPassword: hashedPassword,
        userRole: userRole,
      });

      // Tạo driver và employee mới khi tạo user
      let newDriver = null;
      let newEmployee = null;

      if (userRole === "Driver") {
        // Kiểm tra tồn tại email
        const checkEmail = await Driver.findOne({ driverEmail: userEmail });

        if (checkEmail) {
          return res.status(400).json({ message: "Email đã tồn tại!" });
        }

        // Tạo mã tài xế
        const driverId = await genarateDriverID();

        newDriver = new Driver({
          driverId: driverId,
          driverName: userFullname,
          driverEmail: userEmail,
          driverPhone: userPhone,
          userId: userId, // Gán userId trong bảng driver là userId trong bảng User
        });

        await newDriver.save();
      } else if (userRole !== "Driver") {
        // Kiểm tra tồn tại email
        const checkEmailFromDriver = await Driver.findOne({
          driverEmail: userEmail,
        });
        const checkEmailFromEmployee = await Employee.findOne({
          employeeEmail: userEmail,
        });

        if (checkEmailFromDriver || checkEmailFromEmployee) {
          return res.status(400).json({ message: "Email đã tồn tại!" });
        }

        // Tạo mã tài xế
        const employeeId = await genarateEmployeeID();

        newEmployee = new Employee({
          employeeId: employeeId,
          employeeName: userFullname,
          employeeEmail: userEmail,
          employeePhone: userPhone,
          userId: userId, // Gán userId trong bảng employee là userId trong bảng User
        });

        console.log(newEmployee);
        await newEmployee.save();
      } else {
        return res.status(400).json({ message: "Role không hợp lệ" });
      }

      await newUser.save();
      if (newDriver !== null) {
        return res
          .status(200)
          .json({ message: "Tạo tài khoản thành công!", newUser, newDriver });
      } else if (newEmployee !== null) {
        return res
          .status(200)
          .json({ message: "Tạo tài khoản thành công!", newUser, newEmployee });
      }
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
  getAllUser: async (req, res) => {
    try {
      const users = await User.find({ userRole: { $in: employeeRoleList } });

      if (users.length === 0) {
        return res.status(200).json({ message: "Chưa có tài khoản nào!" });
      }

      const userIds = users.map((user) => user.userId.toString());
      const employees = await Employee.find({ userId: { $in: userIds } });

      const result = users.map((user) => {
        const employeeInfo = employees.find(
          (employee) => employee.userId.toString() === user.userId.toString()
        );

        return {
          userId: user.userId,
          userPhone: user.userPhone,
          userRole: user.userRole,
          userPassword: user.userPassword,
          userStatus: user.userStatus,
          employeeDetail: employeeInfo || null,
        };
      });

      return res.status(200).json(result);
    } catch (error) {
      res.status(500).json(error.message);
    }
  },
  login: async (req, res) => {
    try {
      const { userPhone, userPassword } = req.body;
      const user = await User.findOne({ userPhone: userPhone });
      const employee = await Employee.findOne({ userId: user.userId });
      const employeeFullName = employee.employeeName;
      if (!employee) {
        return res
          .status(400)
          .json({ message: "Tài khoản chưa có thông tin!" });
      }
      if (!user) {
        return res.status(400).json({ message: "Người dùng không tồn tại!" });
      }
      if (user.userRole === "Driver") {
        return res.status(400).json({ message: "Người dùng không tồn tại!" });
      }
      const isPasswordMatch = await bcrypt.compare(
        userPassword,
        user.userPassword
      );
      if (!isPasswordMatch) {
        return res.status(400).json({ message: "Mật khẩu không đúng!" });
      }

      const sessionToken = jwt.sign(
        {
          userId: user.userId,
        },
        process.env.JWT_SECRET
      );

      const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

      const session = await prisma.session.create({
        data: {
          accountId: user.userId,
          token: sessionToken,
          expiresAt,
        },
      });

      user.userStatus = "active";
      await user.save();
      return res.status(200).json({
        message: "Đăng nhập thành công!",
        code: "Success",
        user,
        employeeFullName,
        session,
      });
    } catch (error) {
      res.status(500).json(error.message);
    }
  },
  logout: async (req, res) => {
    try {
      const { phone } = req.params;
      const user = await User.findOne({ userPhone: phone });

      if (!user) {
        return res.status(500).json({ message: "Người dùng không tồn tại!" });
      }
      user.userStatus = "deactive";
      await user.save();
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  getUserByQuery: async (req, res) => {
    try {
      const { id, email, phone } = req.query;
      if (!id && !email && !phone) {
        return res.status(400).json({ message: "Tài khoản không tồn tại!" });
      }

      let searchCondition = {};
      if (id) {
        searchCondition = { userId: id.trim() };
      } else if (phone) {
        searchCondition = { userPhone: phone.trim() };
      }
      const user = await User.findOne(searchCondition);
      if (!user) {
        return res.status(400).json({ message: "Tài khoản không tồn tại!" });
      }
      const employee = await Employee.findOne({ userId: user.userId });
      if (!employee) {
        return res.status(404).json({
          message: "Nhân viên không tồn tại!",
          search: searchCondition,
        });
      }
      return res.status(200).json({
        user,
        employee: employee,
      });
    } catch (error) {
      res.status(500).json(error.message);
    }
  },
  updateAccount: async (req, res) => {
    try {
      const { id } = req.params;
      const { newPassword, newPhone, newEmail } = req.body;

      // Tìm người dùng && chi tiết người dùng
      const user = await User.findOne({ userId: id });
      const employee = await Employee.findOne({ userId: id });
      if (!user) {
        return res.status(404).json({ message: "Tài khoản không tồn tại!" });
      }
      if (!employee) {
        return res
          .status(400)
          .json({ message: "Tài khoản chưa có thông tin!" });
      }

      // Kiểm tra và lưu chỉnh sửa sđt nếu có cập nhật
      if (newPhone !== undefined && newPhone !== "") {
        if (!regexPhoneNumber(newPhone)) {
          return res
            .status(400)
            .json({ message: "Số điện thoại không hợp lệ!" });
        }
        user.userPhone = newPhone;
        employee.employeePhone = newPhone;
      }
      // Kiểm tra và lưu chỉnh sửa gmail nếu có cập nhật
      if (newEmail !== undefined && newEmail !== "") {
        if (!regexGmail(newEmail)) {
          return res.status(400).json({ message: "Email không hợp lệ!" });
        }
        employee.employeeEmail = newEmail;
      }
      // Kiểm tra và lưu chỉnh sửa mật khẩu nếu có cập nhật
      if (newPassword !== undefined && newPassword !== "") {
        if (!checkPasswordStrong(newPassword)) {
          return res.status(400).json({ message: "Mật khẩu chưa an toàn!" });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.userPassword = hashedPassword;
      }

      if (!newPassword && !newPhone && !newEmail) {
        return res
          .status(400)
          .json({ message: "Không có trường nào thay đổi!" });
      }

      await user.save();
      await employee.save();
      return res
        .status(200)
        .json({ message: "Cập nhật thông tin thành công!" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  deleteById: async (req, res) => {
    try {
      const { id } = req.params;
      // Tìm nhân viên và tài khoản nhân viên cần xóa
      const user = await User.findOne({ userId: id });
      if (!user) {
        return res.status(404).json({ message: "Tài khoản không tồn tại!" });
      }
      // Xóa tài khoản và nhân viên
      const deleteUser = User.deleteOne({ userId: id });
      const deleteEmployee = Employee.deleteOne({ userId: id });
      await Promise.all([deleteUser, deleteEmployee]);
      return res
        .status(200)
        .json({ message: "Xóa tài khoản và thông tin thành công!" });
    } catch (error) {
      res.status(500).json(error.message);
    }
  },
  getMe: async (req, res) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      console.log(token);
      if (!token) {
        return res.status(401).json({ message: "Không tìm thấy token" });
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.userId;

      const user = await User.findOne({ userId: userId });
      const employee = await Employee.findOne({ userId: userId });
      console.log(user);
      console.log(employee);
      if (!user) {
        return res.status(404).json({ message: "Người dùng không tồn tại" });
      }
      return res.status(200).json({
        data: {
          userPhone: user.userPhone,
          userRole: user.userRole,
          userName: employee.employeeName,
        },
        message: "Lấy thông tin thành công",
      });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },
};

module.exports = UserController;
