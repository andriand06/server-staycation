const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { Schema, ObjectId } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

/**
 * PRE SAVE THE USER SCHEMA, HASH PASSWORD USING BCRYPT MODULES
 */
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
});
module.exports = mongoose.model("User", userSchema);
