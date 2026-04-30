const mongoose=require('mongoose')

const addOns=new mongoose.Schema({
    addOnsPlanId:{
        type:String
    },
    userType:{
        type:String
    },
    addOnsPlanName:{
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
    },

})

module.exports=mongoose.model('addOns',addOns)