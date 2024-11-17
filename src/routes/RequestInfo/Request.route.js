const RequestController = require("../../controllers/RequestInfo/request.controller");

const router = require("express").Router();

router.post("/create", RequestController.CreateRequest);
router.get("/", RequestController.getAllRequest);
router.get("/:id", RequestController.getRequestByCusID);

module.exports = router;
