const Role = require("../../models/UserInfo/Role.model");

const roleController = {
  // Tạo role mới
  addRole: async (req, res) => {
    try {
      const newRole = new Role(req.body);
      await newRole.save();
      res.status(200).json("Success");
    } catch (error) {
      res.status(500).json(error.message);
    }
  },
};

module.exports = roleController;
