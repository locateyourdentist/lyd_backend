const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: String,
  userType: String,
  // name: String,
  // email: String,
  posterImages: [
    {
      path: String,       
      preference: Number, 
      uploadedAt: { type: Date, default: Date.now },
      isActive:{default:true,type:Boolean},
      startDate:{type:String},
      endDate:{type:String}
    }
  ],
  createdDate: { type: Date, default: Date.now },
  updatedDate: { type: Date, default: Date.now }
});

 module.exports = mongoose.model("imagePoster", userSchema);
