const UserController = require("../../controllers/UserInfo/User.Controller");

const router = require("express").Router();

router.get("/me", UserController.getMe);
router.get("/acc", UserController.getUserByQuery);
router.put("/updateAccount/:id", UserController.updateAccount);
router.delete("/deleteAccount/:id", UserController.deleteById);
router.post("/addUser", UserController.addUser);
router.post("/login", UserController.login);
router.post("/logout/:phone", UserController.logout);
router.get("/", UserController.getAllUser);
router.get("/:id", UserController.getAnUser);

// Lấy info từ token
module.exports = router;
