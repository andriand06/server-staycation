const mongoose = require("mongoose");
const { Schema, ObjectId } = mongoose;
const featureSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  qty: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  itemId: {
    type: ObjectId,
    ref: "Item",
  },
});

//export Feature Model so it can be use in anywhere
module.exports = mongoose.model("Feature", featureSchema);
