const User = require("../../models/UserInfo/User.model");
const Role = require("../../models/UserInfo/Role.model");
const Employee = require("../../models/UserInfo/Employee.model");
const bcrypt = require("bcrypt");
const Driver = require("../../models/DriverInfo/Driver.model");

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

      // Tạo driver mới khi tạo user
      let newDriver = null;

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
      }

      await newUser.save();
      return res.status(200).json({ newUser, newDriver });
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
        let info = null;

        if (user.userRole === "Driver") {
          info = drivers.find(
            (driver) => driver.userId.toString() === user.userId.toString()
          );
        }
        // else if(user.userRole === "Employee"){
        //   info = employees.find(employee => employee.userId.equals(user.userId))
        // }

        return {
          userId: user.userId,
          userPhone: user.userPhone,
          userRole: user.userRole,
          userPassword: user.userPassword,
          userVerify: user.userVerify,
          userStatus: user.userStatus,
          infoDetail: info || null, // Nếu không có thông tin thì trả về null
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
};

module.exports = UserController;
