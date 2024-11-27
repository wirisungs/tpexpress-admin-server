const {
  OrderController,
  DServiceController,
} = require("../../controllers/OrderInfo/Order.controller");

const router = require("express").Router();

router.get("/", OrderController.getAllOrders);
router.get("/count", OrderController.countOrderByStatus);
router.get("/getOrder7Days", OrderController.getOrdersInLast7Days);
router.get("/getRankings", OrderController.getRankingOfWeek);
router.get("/orderDetails", OrderController.getOrderDetails);
router.post("/create", OrderController.createOrder);
router.get("/services/dservices", DServiceController.getAllServices);
router.get("/:id", OrderController.getOrderByCusId);
module.exports = router;
