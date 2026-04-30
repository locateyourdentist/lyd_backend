const mongoose = require("mongoose");

const ContactRequestSchema = new mongoose.Schema(
  {
    senderUserId: {
      type: String,
      required: true,
    },
    receiverUserId: {
      type: String,
      required: true,
    },
    Name: {
      type: String,
      required: true,
    },
    clinicName: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      required: true,
    },
    clinicAddress: {
      state: String,
      district: String,
      city: String,
    },
    email: {
      type: String,
      default: "",
    },
    mobileNumber: {
      type: String,
      default: "",
    },
    materialDescription: {
      type: String,
      required: true,
    },
    contactImage: [{
      type: String,
    }],
    status: {
      type: String,
      enum: ["Pending", "Viewed", "Responded"],
      default: "Pending",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ContactRequest", ContactRequestSchema);
