const mongoose=require('mongoose')


const webinarModel= new mongoose.Schema({
    webinarTitle:{
        type:String
    },
    webinarDescription:{
          type: [Object],   
    },
    orgName:{
        type:String
    },
     createdDate:{
    type:Date,
    default:Date.now
    },
    updatedDate:{
    type:Date,
    default:Date.now
    },
     webinarId:{
        type:Number
     },
     webinarImage:{
        type:String
     },
     userId:{
          type:String,
          required:true
     },
     price:{
        type:String
     },
     userType:{
     type:String,
    },
    details:{
    },
    //  state:{
    //     type:String
    //  },
    //  district:{
    //     type:String
    //  },
    //  city:{
    //  type:String
    //  },
   isActive:{
    type:Boolean,
    default:true}
});
module.exports=mongoose.model('webinar',webinarModel)
