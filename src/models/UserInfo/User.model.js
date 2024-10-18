const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    phonenumber: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
  },
  { collection: "User" }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
