const mongoose = require("mongoose");

const jobCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  userType: {
    type: String,  
    required: true,
  },
  userId:{
    type:String
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  updatedDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("jobCategories", jobCategorySchema);
