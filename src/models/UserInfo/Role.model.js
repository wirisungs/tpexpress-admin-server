const mongoose = require("mongoose");

const RoleSchema = mongoose.Schema(
  {
    roleID: {
      type: String,
      required: true,
      unique: true,
    },
    roleName: {
      type: String,
      required: true,
    },
  },
  { collection: "Role" }
);

const Role = mongoose.model("Role", RoleSchema);

module.exports = Role;
