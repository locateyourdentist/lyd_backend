// const mongoose=require('mongoose')

// const userIds=new mongoose.Schema({
//     id:{type:String},
//     userId:{type:Number}
// })

// module.exports=mongoose.model('userId',userIds)
const mongoose = require("mongoose");

const userIdSchema = new mongoose.Schema({
  state: {
    type: String,
    required: true,
    unique: true
  },
  prefix: {
    type: String,
  },
  counter: {
    type: Number,
    default: 999
  }
});

module.exports = mongoose.model("userId", userIdSchema);