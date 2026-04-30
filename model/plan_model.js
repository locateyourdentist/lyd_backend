const mongoose=require('mongoose')

const  planModel=new mongoose.Schema({
    planId:{
        type:Number,
        unique:true
    },
    userType:{
        type:String
    },
    planName:{
        type:String
    },
     price:{
        type:String
    },
    details:{
        type:Object
    },
    features:{
        type:Array
    },
    duration:{
        type:String
    },
    // startDate:{
    //     type:String
    // },
    // endDate:{
    //     type:String
    // },
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

module.exports=mongoose.model('plan',planModel)