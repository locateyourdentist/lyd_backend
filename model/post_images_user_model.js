const mongoose=require('mongoose')

const postImagesUserModel=new mongoose.Schema({
    userId:{
        type:String
    },
    postImagesPlanId:{
        type:String
    },
    postImageUserId:{
        type:String,
        unique:true
    },
    price:{
        type:String
    },
     userType:{
        type:String
    },
    postPlanName:{
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

module.exports=mongoose.model('postImagesUserPlan',postImagesUserModel)