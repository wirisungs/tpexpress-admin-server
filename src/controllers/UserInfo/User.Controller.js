const User = require("../../models/UserInfo/User.model");
const Role = require("../../models/UserInfo/Role.model");
const Employee = require("../../models/UserInfo/Employee.model");
const bcrypt = require("bcrypt");
const Driver = require("../../models/DriverInfo/Driver.model");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const employeeRoleList = ["Admin", "Saleperson", "Supporter"];

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

      // Kiểm tra tồn tài số điện thoại
      const phoneExisted = await User.findOne({ userPhone: userPhone });
      if (phoneExisted) {
        return res.status(400).json({ message: "Số điện thoại đã tồn tại!" });
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
      } else if (employeeRoleList.includes(userRole)) {
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
        return res.status(200).json({ newUser, newDriver });
      } else if (newEmployee !== null) {
        return res.status(200).json({ newUser, newEmployee });
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
      const UserPromise = User.find({});
      const EmployeePromise = Employee.find({});
      const DriverPromise = Driver.find({});

      const [users, employees, drivers] = await Promise.all([
        UserPromise,
        EmployeePromise,
        DriverPromise,
      ]);

      const result = users.map((user) => {
        let driverInfo = null;
        let employeeInfo;

        if (user.userRole === "Driver") {
          driverInfo = drivers.find(
            (driver) => driver.userId.toString() === user.userId.toString()
          );
        }
        if (employeeRoleList.includes(user.userRole)) {
          employeeInfo = employees.find(
            (employee) => employee.userId.toString() === user.userId.toString()
          );
        }

        return {
          userId: user.userId,
          userPhone: user.userPhone,
          userRole: user.userRole,
          userPassword: user.userPassword,
          userVerify: user.userVerify,
          userStatus: user.userStatus,
          driverDetail: driverInfo || null, // Nếu không có thông tin thì trả về null
          employeeDetail: employeeInfo || null, // Nếu không có thông tin thì trả về null
        };
      });

      if (result.every((user) => user.info === null)) {
        return res.status(200).json({ message: "Chưa có tài khoản nào!" });
      }

      return res.status(200).json(result);
    } catch (error) {
      res.status(500).json(error.message);
    }
  },
  login: async (req, res) => {
    try {
      const { userPhone, userPassword } = req.body;
      const user = await User.findOne({ userPhone: userPhone });
      if (!user) {
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
      return res.status(200).json({
        message: "Đăng nhập thành công!",
        code: "Success",
        user,
        session,
      });
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
      const employee = await Driver.findOne({ userId: userId });
      console.log(user);
      console.log(employee);
      if (!user) {
        return res.status(404).json({ message: "Người dùng không tồn tại" });
      }
      return res.status(200).json({
        data: {
          userPhone: user.userPhone,
          userRole: user.userRole,
          userName: employee.driverName,
        },
        message: "Lấy thông tin thành công",
      });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },
};

module.exports = UserController;
