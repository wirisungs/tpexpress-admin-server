const CustomerController = require("../../controllers/CustomerInfo/Customer.controller");

const router = require("express").Router();

router.get("/Customers", CustomerController.getAllCustomers);
module.exports = router;
