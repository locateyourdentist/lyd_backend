const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  planId: { type: String, required: true },
  planName: { type: String, required: true },
  planType: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  amount: { type: Number, required: true },
  invoiceId: { type: String, required: true, unique: true },
  taxSummary: { type: Object, default: {} },
  company: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Invoice", invoiceSchema);