const {
  OrderController,
  DServiceController,
} = require("../../controllers/OrderInfo/Order.controller");

const router = require("express").Router();

router.get("/", OrderController.getAllOrders);
router.get("/count", OrderController.countOrderByStatus);
router.get("/getOrder5Days", OrderController.getOrdersInLast7Days);
router.get("/getRankings", OrderController.getRankingOfWeek);
router.post("/create", OrderController.createOrder);
router.get("/services/dservices", DServiceController.getAllServices);
router.get("/:id", OrderController.getOrderByCusId);
module.exports = router;
