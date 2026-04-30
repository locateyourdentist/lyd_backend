const mongoose=require('mongoose')

const postImagesPlanIdModel=new mongoose.Schema({
    postImagesPlanId:{
        type:String
    },
    userType:{
        type:String
    },
    postPlanName:{
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

module.exports=mongoose.model('postImagesPlan',postImagesPlanIdModel)