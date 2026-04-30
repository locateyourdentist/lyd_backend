const mongoose=require('mongoose')


const webinarApplyModel= new mongoose.Schema({
   webinarId:{
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
      type:String
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
module.exports=mongoose.model('webinarApplication',webinarApplyModel)
