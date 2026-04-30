const mongoose=require('mongoose')

const userIds=new mongoose.Schema({
    id:{type:String},
    userId:{type:Number}
})

module.exports=mongoose.model('userId',userIds)