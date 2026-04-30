const mongoose=require('mongoose')

const webinarUserModel=new mongoose.Schema({
    userId:{
        type:String
    },
    webinarPlanUserId:{
        type:String
    },
    webinarPlanId:{
        type:String

    },
    price:{
        type:String
    },
    webinarUserPlansName:{
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

module.exports=mongoose.model('webinarUserPlan',webinarUserModel)