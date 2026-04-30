const mongoose=require('mongoose')

const privacyPolicy=new mongoose.Schema({
    userId:{type:String},
    category:{type:String},
    data:{type:Object},
    createdDate:{
    type:Date,
    default:Date.now
    }
})

module.exports=mongoose.model('privacyPolicy',privacyPolicy)