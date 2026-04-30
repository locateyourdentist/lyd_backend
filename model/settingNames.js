const mongoose=require('mongoose')

const settingsName=new mongoose.Schema({
    userType:{
        type:mongoose.Schema.Types.ObjectId,
    },
    settingsName:{
        type:String
    }
})

module.exports=mongoose.model('settingsName',settingsName)
