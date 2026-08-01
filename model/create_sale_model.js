const mongoose = require('mongoose');

const salePostSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    userType: {
      type: String,
      required: true,
    //  enum: ['Dental Clinic', 'Dental Shop', 'Dental Lab', 'Dental Mechanic', 'Dental Professional'],
    },
    mobileNumber: { type: String, required: true },
    message: { type: String, required: true },
    price: { type: String, required: true },
    images: [{ type: String }],
    startDate: { type: String },
    endDate: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true } 
);

module.exports=mongoose.model('SalePost', salePostSchema)