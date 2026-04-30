const mongoose=require('mongoose')

const  webinarIdModel=mongoose.Schema({
   id:{
    type:String
   },
   webinarPlanId:{
    type:Number
   } ,
   id1:{
    type:String
   },
   webinarPlanUserId:{
    type:Number
   } 
})

module.exports=mongoose.model('webinarPlanId',webinarIdModel)