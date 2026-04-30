const mongoose=require('mongoose')

const jobPlanModel=new mongoose.Schema({
    jobPlansId:{
        type:String
    },
    userType:{
        type:String
    },
    jobPlanName:{
        type:String
    },
    price:{
        type:String
    },
    count:{
        type:Object
    },
    features:{
        type:Object
    },
    details:{
        type:Object,
    },
    duration:{type:String},
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
    },

})

module.exports=mongoose.model('jobPlan',jobPlanModel)