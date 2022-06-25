const mongoose = require("mongoose");
const { Schema } = mongoose;
const bookingSchema = new Schema({
  invoice: {
    type: String,
    required: true,
  },
  bookingStartDate: {
    type: Date,
    required: true,
  },
  bookingEndDate: {
    type: Date,
    required: true,
  },
  itemId: {
    _id: {
      type: mongoose.ObjectId,
      ref: "Item",
    },
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
  },
  total: {
    type: Number,
    required: true,
  },
  memberId: {
    type: mongoose.ObjectId,
    ref: "Member",
  },
  bankId: {
    type: mongoose.ObjectId,
    ref: "Bank",
  },
  payments: {
    proofPayment: {
      type: String,
      required: true,
    },
    bankFrom: {
      type: String,
      required: true,
    },
    accountHolder: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  imageUrl: {
    type: String,
  },
});

//export Booking Model so it can be use in anywhere
module.exports = mongoose.model("Booking", bookingSchema);
