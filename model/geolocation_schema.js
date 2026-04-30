const mongoose=require('mongoose')

const  geoLocationModel=new mongoose.Schema({
  geolocation: {
  type: { type: String, enum: ['Point'], default: 'Point' },
  coordinates: {
    type: [Number], // [longitude, latitude]
    index: '2dsphere'
  }
},
  createdDate:{
    type:Date,
    default:Date.now
  },
  updatedDate:{
    type:Date,
    default:Date.now
  }
});

module.exports=mongoose.model('geoLocation',geoLocationModel)
