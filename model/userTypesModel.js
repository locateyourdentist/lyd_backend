const mongoose=require('mongoose')

const userTypes=mongoose.Schema({
   id:{
    type:String,
    unique:true
   },
    userType:{
        type:String,
        required:true
    },
})

module.exports=mongoose.model('userTypes',userTypes)