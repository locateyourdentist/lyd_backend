const mongoose = require("mongoose");

const addInvoiceId = new mongoose.Schema({
    key: String,
    invoiceId: Number
});

module.exports=mongoose.model('InvoiceId',addInvoiceId)