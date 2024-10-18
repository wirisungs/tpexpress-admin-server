const Driver = require("../../models/DriverInfo/Driver.model");

const DriverController = {
  // Get all driver
  getAllDriver: async (req, res) => {
    try {
      const drivers = await Driver.find();
      if (!drivers) {
        return res.status(400).json({ Message: "Không có tài xế" });
      }
      return res.status(200).json(drivers);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },

  // Enroll Driver
  enrollNewDriver: async (req, res) => {
    try {
      const newDriver = new Driver(req.body);
      // Check mã tài xế
      const checkID = await Driver.findOne({ driver_ID: newDriver.driver_ID });
      if (checkID) {
        return res.status(400).json({ message: "Mã tài xế đã tồn tại!" });
      }

      // Check email
      const checkEmail = await Driver.findOne({
        driver_Email: newDriver.driver_Email,
      });
      if (checkEmail) {
        return res.status(400).json({ message: "Email tài xế đã tồn tại!" });
      }

      // Check phone
      const checkPhone = await Driver.findOne({
        driver_Phone: newDriver.driver_Phone,
      });
      if (checkPhone) {
        return res
          .status(400)
          .json({ message: "Số điện thoại tài xế đã tồn tại!" });
      }

      // Check giấy phép lái xe
      const checkDriverLicense = await Driver.findOne({
        driver_LicenseID: newDriver.driver_LicenseID,
      });
      if (checkDriverLicense) {
        return res.status(400).json({ message: "Bằng lái tài xế đã tồn tại!" });
      }
      if (newDriver.driver_LicenseID.length !== 12) {
        return res.status(400).json({ message: "Bằng lái phải gồm 12 số!" });
      }

      // Check mã CCCD/CMND
      const checkNationalID = await Driver.findOne({
        driver_NationalID: newDriver.driver_NationalID,
      });
      if (checkNationalID) {
        return res.status(400).json({ message: "CCCD đã tồn tại!" });
      }
      if (newDriver.driver_NationalID.length !== 12) {
        return res.status(400).json({ message: "CCCD phải gồm 12 số!" });
      }

      // Check biển số xe
      const checkLicensePlate = await Driver.findOne({
        driver_LicensePlate: newDriver.driver_LicensePlate,
      });
      if (checkLicensePlate) {
        return res.status(400).json({ message: "Biển số xe đã tồn tại!" });
      }
      // Check quốc tịch
      if (newDriver.driver_Nationality !== "Việt Nam") {
        return res.status(400).json({ message: "Quốc tịch phải là Việt Nam!" });
      }
      await newDriver.save();
      return res.status(200).json({ message: "Đăng ký thành công" });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },
};

module.exports = DriverController;
