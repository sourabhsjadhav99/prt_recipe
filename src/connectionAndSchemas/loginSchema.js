const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: { type: String, unique: true },
    password: { type: String },
  }
);

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;
