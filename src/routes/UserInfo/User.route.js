const UserController = require("../../controllers/UserInfo/User.Controller");

const router = require("express").Router();

router.post("/addUser", UserController.addUser);
router.get("/:id", UserController.getAnUser);
module.exports = router;
