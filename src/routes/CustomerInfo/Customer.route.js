const CustomerController = require("../../controllers/CustomerInfo/Customer.controller");

const router = require("express").Router();

router.get("/", CustomerController.getAllCustomers);
router.get("/cus", CustomerController.getACustomerWithQuery);
router.post("/create", CustomerController.createCustomer);
module.exports = router;
