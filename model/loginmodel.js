const mongoose=require('mongoose')

const  loginModel=new mongoose.Schema({
    email:{type:String},
    password:{type:String},
    userId:{type:String},
    userType:{type:String},
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

module.exports=mongoose.model('login',loginModel)