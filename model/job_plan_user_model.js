const mongoose=require('mongoose')

const jobPlansUserModel=new mongoose.Schema({
    userId:{
        type:String
    },
    jobPlansId:{
        type:String
    },
    jobPlansUserId:{
        type:String,
        unique:true
    },
    price:{
        type:String
    },
    jobPlansName:{
        type:String
    },
    startDate:{
        type:String
    },
    endDate:{
        type:String
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

})

module.exports=mongoose.model('jobPlansUser',jobPlansUserModel)