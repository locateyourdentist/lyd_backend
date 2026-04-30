const mongoose=require('mongoose')

const saveToken=new mongoose.Schema({
    userId:{
        type:String,
    },
     userType:{
        type:String
    },
    fcmToken:{
        type:String
    },
    createdDate:{
        type:Date,
        default:Date.now
    },
     updatedDate:{
        type:Date,
        default:Date.now
    },
    isActive:{
        type:Boolean
    }
    
})

module.exports=mongoose.model('fcmToken',saveToken)