const mongoose=require('mongoose')
const userId = require('./userId')

const notificationModel=new mongoose.Schema({
    // id:{
    //     type:String,
    //     unique:true
    // },
    userId:{
        type:String
    },
    userType:{
        type:String
    },
    title:{
        type:String
    },
    message:{
        type:String
    },
    notificationImage:{
        type:String
    },
    state:{
        type:String
    },
    district:{
        type:String
    },
    city:{
        type:String
    },
    area:{
        type:String
    },
    read:{
        type:String,
        default:false
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
module.exports=mongoose.model('notification',notificationModel)
