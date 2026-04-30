const mongoose=require('mongoose')

const serviceIds=new mongoose.Schema({
    id:{type:String},
    serviceId:{type:Number},
     id:{type:String},
    notificationId:{type:Number}
})

module.exports=mongoose.model('serviceId',serviceIds)