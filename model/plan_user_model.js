const mongoose=require('mongoose')

const  planUserModel=new mongoose.Schema({
    userId:{
        type:String
    },
    userType:{
        type:String
    },
    planUserId:{
        type:Number,
        unique:true
    },
     planId:{
        type:Number,
    },
    price:{
        type:Number
    },
    planName:{
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
    }
})

module.exports=mongoose.model('userPlan',planUserModel)