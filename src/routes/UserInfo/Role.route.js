const express = require("express");
const router = express.Router();
const roleController = require("../../controllers/UserInfo/Role.controller");

router.post("/addRole", roleController.addRole);

module.exports = router;
