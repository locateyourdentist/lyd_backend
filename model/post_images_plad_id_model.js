const mongoose=require('mongoose')

const  postImagesIdModel=mongoose.Schema({
  id: {
    type: String,   
  },
  postImagesId: {
    type: Number,
  },
  id1: {
    type: String,  
  },
  postImageUserId: {
    type: Number,
  }
});

module.exports=mongoose.model('postImagesId',postImagesIdModel)