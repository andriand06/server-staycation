const mongoose = require("mongoose");
const { Schema, ObjectId } = mongoose;
const categorySchema = new Schema({
  name: {
    type: String,
    required: [true, "Please fill name field!"],
  },
  itemId: [
    {
      type: ObjectId,
      ref: "Item",
    },
  ],
});

//export Category Model so it can be use in anywhere
module.exports = mongoose.model("Category", categorySchema);
