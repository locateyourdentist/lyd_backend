const mongoose=require('mongoose')

const branchModel=new mongoose.Schema({

branches: [
  {
    branchName: String,
    // parentId:String,
    state: String,
    district: String,
    city: String,
    area: String,
    pincode: String,
    location: String,
    plan: {
      planId: Number,
      planName: String,
      isActive: {
        type: Boolean,
        default: false
      },
      startDate: Date,
      endDate: Date
    }
  }
]
})

module.exports=mongoose.model('branch',branchModel)