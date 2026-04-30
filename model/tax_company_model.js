
const mongoose = require('mongoose');

const taxSummarySchema = new mongoose.Schema({
  baseAmount: Number,
  cgst: Number,
  sgst: Number,
  igst: Number,
  totalAmount: Number,
  taxType: { type: String, enum: ['CGST_SGST', 'IGST'] }
});

const invoiceSchema = new mongoose.Schema({
  invoiceId: { type: String, required: true, unique: true },
  userId: String,
  userName: String,
  mobileNumber: String,
  email: String,
  planId: String,
  planName: String,
  companyId: String,
  taxSummary: taxSummarySchema,
  paymentMode: { type: String, enum: ['ONLINE','OFFLINE'] },
  startDate: Date,
  endDate: Date,
  invoiceDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Invoices', invoiceSchema);