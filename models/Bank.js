const mongoose = require("mongoose");
const { Schema } = mongoose;
const bankSchema = new Schema({
  bankName: {
    type: String,
    required: true,
  },
  accountNumber: {
    type: Number,
    required: true,
  },
  accountName: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
});

//export Bank Model so it can be use in anywhere
module.exports = mongoose.model("Bank", bankSchema);
