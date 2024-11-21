const RequestController = require("../../controllers/RequestInfo/Request.controller");

const router = require("express").Router();

router.post("/create", RequestController.CreateRequest);
router.get("/", RequestController.getAllRequest);
router.put("/update/:id", RequestController.updateRequest);
router.get("/:id", RequestController.getRequestByCusID);

module.exports = router;
