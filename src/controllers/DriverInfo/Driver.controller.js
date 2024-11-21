const Driver = require("../../models/DriverInfo/Driver.model");
const User = require("../../models/UserInfo/User.model");

const formatDate = (datetime) => {
  const date = new Date(datetime);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${day}-${month}-${year}`;
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

const DriverController = {
  // Get all driver
  getAllDriver: async (req, res) => {
    try {
      const drivers = await Driver.aggregate([
        // Link với bảng Order để lấy đơn hàng của từng tài xế
        {
          $lookup: {
            from: "Order",
            localField: "driverId",
            foreignField: "driverId",
            as: "orders",
          },
        },
        // Đếm số lượng đơn hàng với `orderStatusId` là "ST002" (Đang giao)
        {
          $project: {
            driverId: 1,
            driverName: 1,
            driverEmail: 1,
            driverPhone: 1,
            driverAddress: 1,
            driverBirthday: 1,
            driverCCCDDate: 1,
            driverCCCD: 1,
            driverLicenseId: 1,
            driverVehicleBSX: 1,
            driverLicenseType: 1,
            driverGender: 1,
            driverViolation: 1,
            driverStatus: 1,
            driverNationality: 1,
            activeOrderCount: {
              $size: {
                $filter: {
                  input: "$orders",
                  as: "order",
                  cond: { $eq: ["$$order.orderStatusId", "ST002"] },
                },
              },
            },
          },
        },
      ]);

      res.status(200).json(drivers);
    } catch (error) {
      res.status(500).json(error.message);
    }
  },

  getDriverById: async (req, res) => {
    try {
      const { id } = req.params;
      const driver = await Driver.aggregate([
        { $match: { driverId: id } },
        {
          $lookup: {
            from: "Vehicle",
            localField: "driverVehicleBSX",
            foreignField: "vehicleLicenseBSX",
            as: "vehicleDetails",
          },
        },
        {
          $unwind: {
            path: "$vehicleDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            driverId: 1,
            driverName: 1,
            driverEmail: 1,
            driverPhone: 1,
            driverAddress: 1,
            driverBirth: 1,
            driverCCCDDate: 1,
            driverCCCD: 1,
            driverLicenseId: 1,
            driverVehicleBSX: 1,
            driverLicenseType: 1,
            driverGender: 1,
            driverViolation: 1,
            driverStatus: 1,
            driverNationality: 1,
            vehicleDetails: 1,
          },
        },
      ]);

      if (driver.length === 0) {
        return res.status(400).json("Không có dữ liệu");
      }

      res.status(200).json(driver);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Enroll Driver
  enrollNewDriver: async (req, res) => {
    try {
      const driverID = await genarateDriverID();
      const newDriver = new Driver({ driverId: driverID, ...req.body });
      await newDriver.save();
      // // Check mã tài xế
      // const checkID = await Driver.findOne({ driver_ID: newDriver.driverId });
      // if (checkID) {
      //   return res.status(400).json({ message: "Mã tài xế đã tồn tại!" });
      // }

      // // Check email
      // const checkEmail = await Driver.findOne({
      //   driver_Email: newDriver.driverEmail,
      // });
      // if (checkEmail) {
      //   return res.status(400).json({ message: "Email tài xế đã tồn tại!" });
      // }

      // // Check phone
      // const checkPhone = await Driver.findOne({
      //   driver_Phone: newDriver.driverPhone,
      // });
      // if (checkPhone) {
      //   return res
      //     .status(400)
      //     .json({ message: "Số điện thoại tài xế đã tồn tại!" });
      // }

      // // Check giấy phép lái xe
      // const checkDriverLicense = await Driver.findOne({
      //   driver_LicenseID: newDriver.driverLicenseID,
      // });
      // if (checkDriverLicense) {
      //   return res.status(400).json({ message: "Bằng lái tài xế đã tồn tại!" });
      // }
      // if (newDriver.driver_LicenseID.length !== 12) {
      //   return res.status(400).json({ message: "Bằng lái phải gồm 12 số!" });
      // }

      // // Check mã CCCD/CMND
      // const checkNationalID = await Driver.findOne({
      //   driver_NationalID: newDriver.driverNationalId,
      // });
      // if (checkNationalID) {
      //   return res.status(400).json({ message: "CCCD đã tồn tại!" });
      // }
      // if (newDriver.driver_NationalID.length !== 12) {
      //   return res.status(400).json({ message: "CCCD phải gồm 12 số!" });
      // }

      // // Check biển số xe
      // const checkLicensePlate = await Driver.findOne({
      //   driver_LicensePlate: newDriver.driver_LicensePlate,
      // });
      // if (checkLicensePlate) {
      //   return res.status(400).json({ message: "Biển số xe đã tồn tại!" });
      // }
      // // Check quốc tịch
      // if (newDriver.driver_Nationality !== "Việt Nam") {
      //   return res.status(400).json({ message: "Quốc tịch phải là Việt Nam!" });
      // }
      // await newDriver.save();
      return res.status(200).json(newDriver);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },
  checkDriver: async (req, res) => {
    try {
      console.log(req.params.userId);
      const userAccount = await User.findOne({ userId: req.params.userId });
      if (!userAccount) {
        return res
          .status(400)
          .json({ message: "Không tìm thấy tài khoản của tài xế!" });
      }
      res.status(200).json(userAccount);
    } catch (error) {
      res.status(500).json(error.message);
    }
  },

  // Xóa tài xế
  deleteById: async (req, res) => {
    try {
      const { id } = req.params;
      // Tìm User kết nối với tài xế và xóa
      const driver = await Driver.findOne({ driverId: id });
      const userId = driver.userId;
      if (userId) {
        await User.deleteOne({ userId: userId });
      }

      // Xóa tài xế
      const deletedDriver = await Driver.deleteOne({ driverId: id });
      if (!deletedDriver) {
        return res.status(400).json({ message: "Tài xế không tồn tại" });
      }
      res.status(200).json({ message: "Xóa thành công" });
    } catch (error) {
      res.status(500).json(error.message);
    }
  },
  updateDriverById: async (req, res) => {
    try {
      const { id } = req.params;
      const updateFields = req.body;

      const driver = await Driver.findOne({ driverId: id });

      if (!driver) {
        return res.status(404).json({ message: "Tài xế không tồn tại" });
      }

      const updateData = {};
      for (const key in updateFields) {
        // Chỉ cập nhật các trường có giá trị khác với giá trị hiện tại
        if (
          (driver[key] === null || driver[key] !== updateFields[key]) &&
          updateFields[key] !== undefined &&
          updateFields[key] !== ""
        ) {
          updateData[key] = updateFields[key];
        }
      }

      if (Object.keys(updateData).length === 0) {
        return res
          .status(400)
          .json({ message: "Không có trường nào cập nhật" });
      }

      // Cập nhật tài xế dựa trên driverId
      const updatedDriver = await Driver.findOneAndUpdate(
        { driverId: id },
        updateData,
        { new: true }
      );

      res
        .status(200)
        .json({ message: "Cập nhật thành công", data: updatedDriver });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getDriverByQuery: async (req, res) => {
    try {
      const { id, email, phone } = req.query;
      if (!id && !email && !phone) {
        return res.status(400).json({ message: "Tài xế không tồn tại!" });
      }

      let searchCondition = {};
      if (id) {
        searchCondition = { driverId: id.trim() };
      } else if (email) {
        searchCondition = { driverEmail: email.trim() };
      } else if (phone) {
        searchCondition = { driverPhone: phone.trim() };
      }
      const driver = await Driver.findOne(searchCondition);
      if (!driver) {
        return res.status(404).json({
          message: "Tài xế không tồn tại!",
          search: searchCondition,
        });
      }
      return res.status(200).json(driver);
    } catch (error) {
      res.status(500).json(error.message);
    }
  },
};

module.exports = DriverController;
