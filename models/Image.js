const mongoose = require("mongoose");
const { Schema } = mongoose;
const imageSchema = new Schema({
  imageUrl: {
    type: String,
    required: true,
  },
});

//export Image Model so it can be use in anywhere
module.exports = mongoose.model("Image", imageSchema);
