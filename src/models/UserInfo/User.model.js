const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    userPhone: {
      type: String,
      required: true,
      unique: true,
    },
    userPassword: {
      type: String,
      required: true,
    },
    userStatus: {
      type: String,
      required: true,
      default: "deactive",
    },
    userRole: {
      type: String,
      ref: "Role",
      required: true,
    },
    userVerify: {
      type: Boolean,
      default: false,
    },
  },
  { collection: "User" }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
