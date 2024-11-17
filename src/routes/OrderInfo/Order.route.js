const {
  OrderController,
  DServiceController,
} = require("../../controllers/OrderInfo/Order.controller");

const router = require("express").Router();

router.get("/", OrderController.getAllOrders);
router.get("/:id", OrderController.getOrderByCusId);
router.post("/create", OrderController.createOrder);
router.get("/services/dservices", DServiceController.getAllServices);

module.exports = router;
