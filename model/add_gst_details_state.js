const mongoose=require('mongoose')

const  addGstDetailsModel=new mongoose.Schema({
  userId:{type:String },
  isShowGst:{type:Boolean},
  cgst: Number,
  sgst: Number,
  igst: Number,
  // state:String,
  isActive:{
    type:Boolean,
    default:true
  },
  createdDate:{
    type:Date,
    default:Date.now
  },
  updatedDate:{
    type:Date,
    default:Date.now
  }
});

module.exports=mongoose.model('addGstDetails',addGstDetailsModel)