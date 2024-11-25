const DriverController = require("../../controllers/DriverInfo/Driver.controller");

const router = require("express").Router();

router.get("/", DriverController.getAllDriver);
router.get("/dri", DriverController.getDriverByQuery);
router.post("/addField", DriverController.addDriverAvatarField);
router.put("/updateAvatar/:id", DriverController.updateAvatar);
router.get("/:id", DriverController.getDriverById);
router.get("/checkuser/:userId", DriverController.checkDriver);
router.post("/create", DriverController.enrollNewDriver);
router.delete("/delete/:id", DriverController.deleteById);
router.post("/update/:id", DriverController.updateDriverById);
module.exports = router;
