const EmployeeController = require("../../controllers/UserInfo/Employee.controller");

const router = require("express").Router();

router.post("/addEmployee", EmployeeController.addEmployee);

module.exports = router;
