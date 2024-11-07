const DriverController = require("../../controllers/DriverInfo/Driver.controller");

const router = require("express").Router();

router.get("/", DriverController.getAllDriver);
router.get("/:id", DriverController.getDriverById);
router.get("/checkuser/:userId", DriverController.checkDriver);
router.post("/create", DriverController.enrollNewDriver);
router.delete("/delete/:id", DriverController.deleteById);
module.exports = router;
