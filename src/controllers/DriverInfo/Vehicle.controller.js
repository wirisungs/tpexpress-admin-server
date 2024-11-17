const Vehicle = require("../../models/DriverInfo/Vehicle.model");

const VehicleController = {
  getVehicle: async (req, res) => {
    try {
      const { id } = req.params;
      const vehicle = await Vehicle.findOne({ vehicleLicenseBSX: id });
      if (!vehicle) {
        return res.status(400).json({ message: "Thông tin xe không tồn tại!" });
      }
      res.status(200).json(vehicle);
    } catch (error) {
      res.status(500).json(error.message);
    }
  },
};
module.exports = VehicleController;
