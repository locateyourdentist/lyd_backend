const mongoose=require('mongoose')


const jobModel= new mongoose.Schema({
   jobId:{
        type:Number
     },
     jobSeekerId:{
        type:String
     },
     userType:{
     type:String,
    },
     isViewed:{
      type:Boolean,
      default:false
     },
     status:{
      type:String,
      default:"Applied"
     },
     isApplied:{
        type:Boolean,
        default:true
     },
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
  },
});
module.exports=mongoose.model('jobSeeker',jobModel)
