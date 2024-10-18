const OrderController = require("../../controllers/OrderInfo/Order.controller");

const router = require("express").Router();

router.get("/Orders", OrderController.getAllOrder);

module.exports = router;
