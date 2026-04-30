const mongoose=require('mongoose')

const  addOnsIdModel=mongoose.Schema({
   id:{
    type:String
   },
   addOnsPlanId:{
    type:Number
   },
     id1:{
    type:String
   },
   addOnsUserId:{
    type:Number
   } 
})

module.exports=mongoose.model('addOnsId',addOnsIdModel)