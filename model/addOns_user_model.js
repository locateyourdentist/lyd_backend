const mongoose=require('mongoose')

const  addOnsPlanUserModel=new mongoose.Schema({
    userId:{
        type:String
    },
    addOnsUserId:{
        type:Number,
        unique:true
    },
    //  planId:{
    //     type:Number,
    // },
    addOnsPlanId:{
        type:String
    },
    addOnsPlanName:{
        type:String
    },
    details:{type:Object
    },
    price:{
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

module.exports=mongoose.model('userAddonsPlan',addOnsPlanUserModel)