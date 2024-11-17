const UserController = require("../../controllers/UserInfo/User.Controller");

const router = require("express").Router();

router.get("/me", UserController.getMe);
router.post("/addUser", UserController.addUser);
router.post("/login", UserController.login);
router.get("/", UserController.getAllUser);
router.get("/:id", UserController.getAnUser);

// Lấy info từ token
module.exports = router;
