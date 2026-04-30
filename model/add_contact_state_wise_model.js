const mongoose = require("mongoose");

// Subdocument schema for each contact
const contactDetailSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  state: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  whatsapp: { type: String, required: true },
  email: { type: String, required: true, trim: true },
  district: { type: String, default: null },
  city: { type: String, default: null },
});

// Main schema
const contactSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  details: { type: [contactDetailSchema], default: [] }, // Array of subdocuments
}, {
  timestamps: true
});

module.exports = mongoose.model("ContactsStateWise", contactSchema);