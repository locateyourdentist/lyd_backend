const mongoose=require('mongoose')

const webinarPlanModel=new mongoose.Schema({
    webinarPlanId:{
        type:String
    },
    userType:{
        type:String
    },
    webinarPlanName:{
        type:String
    },
    price:{
        type:String
    },
    features:{
        type:Object
    },
    details:{
        type:Object,
    },
    duration:{type:String},
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

module.exports=mongoose.model('webinarPlan',webinarPlanModel)