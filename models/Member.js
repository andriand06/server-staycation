const mongoose = require("mongoose");
const { Schema } = mongoose;
const memberSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
});

//export Member Model so it can be use in anywhere
module.exports = mongoose.model("Member", memberSchema);
