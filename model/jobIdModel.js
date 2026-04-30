const mongoose=require('mongoose')

const  jobIdModel=mongoose.Schema({
   id:{
    type:String
   },
   jobId:{
    type:Number
   },
     id1:{
    type:String
   },
   webinarId:{
    type:Number
   } 
})

module.exports=mongoose.model('jobId',jobIdModel)