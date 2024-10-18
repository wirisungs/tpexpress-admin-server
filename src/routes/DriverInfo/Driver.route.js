const DriverController = require("../../controllers/DriverInfo/Driver.controller");

const router = require("express").Router();

router.get("/", DriverController.getAllDriver);
router.post("/enrollDriver", DriverController.enrollNewDriver);
module.exports = router;
