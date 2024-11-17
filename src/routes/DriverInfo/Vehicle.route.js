const VehicleController = require("../../controllers/DriverInfo/Vehicle.controller");

const router = require("express").Router();

router.get("/:id", VehicleController.getVehicle);
module.exports = router;
