const mongoose=require('mongoose')

const appLogo=new mongoose.Schema({
    userId:{type:String},
    appLogo:{type:String},
    createdDate:{type:Date,default:Date.now}
})

module.exports=mongoose.model('appLogo',appLogo)