const DriverController = require("../../controllers/DriverInfo/Driver.controller");
const VehicleController = require("../../controllers/DriverInfo/Vehicle.controller");

const router = require("express").Router();

router.get("/", DriverController.getAllDriver);
router.get("/:id", DriverController.getDriverById);
router.get("/checkuser/:userId", DriverController.checkDriver);
router.post("/create", DriverController.enrollNewDriver);
router.delete("/delete/:id", DriverController.deleteById);
router.post("/update/:id", DriverController.updateDriverById);
module.exports = router;
