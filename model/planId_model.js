const mongoose=require('mongoose')

const planIds=new mongoose.Schema({
    id:{type:String},
    planId:{type:Number},
    id1:{type:String},
    planUserId:{type:Number}
})

module.exports=mongoose.model('planId',planIds)