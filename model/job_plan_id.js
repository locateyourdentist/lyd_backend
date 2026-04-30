const mongoose=require('mongoose')

const  jobPlansIdModel=mongoose.Schema({
   id:{
    type:String
   },
   jobPlansId:{
    type:Number
   },
     id1:{
    type:String
   },
   jobPlansUserId:{
    type:Number
   } 
})

module.exports=mongoose.model('jobPlansId',jobPlansIdModel)