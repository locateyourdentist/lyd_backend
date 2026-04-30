const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  street: String,
//   line2: String,
  city: String,
  state: String,
  stateCode: String,
  pincode: String,
  country: String
});

const companySchema = new mongoose.Schema({
    userId: String,  
  companyName: { type: String, required: true },
  gstin: { type: String, required: true },
  address: addressSchema,
  email: String,
  phone: String
});

module.exports = mongoose.model('Company',companySchema,);
