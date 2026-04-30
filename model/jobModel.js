const mongoose=require('mongoose')


const jobModel= new mongoose.Schema({
    jobTitle:{
        type:String
    },
    jobDescription:{
        //type:[String]
          type: [Object],   

    },
jobCategory: {
  type: [String],
  default: []
},
    orgName:{
      type:String
    },
   createdDate:{
    type:Date,
    default:Date.now
  },
  qualification:{
   type:String
  },
  updatedDate:{
    type:Date,
    default:Date.now
  },
     jobType:{
        type:String
     },
     jobId:{
        type:Number
     },
     userId:{
          type:String,
          required:true
     },
     status:{
      type:String
     },
     salary:{
      type:String
     },
     experience:{
      type:String
     },
     userType:{
     type:String,
    },
     state:{
        type:String
     },
     district:{
        type:String
     },
     city:{
     type:String
     },
      jobImage:{
        type:String
     },
      details:{
        type:Object
     },
     isViewed:{
      type:Boolean,
      default:false
     },
   isActive:{
    type:Boolean,
    default:true}
});
module.exports=mongoose.model('jobs',jobModel)
