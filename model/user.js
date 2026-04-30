// const mongoose=require('mongoose')

// const userModel=new mongoose.Schema({
//     userId:{
//         type:String,
//         unique:true
//     },
//     name:{
//         type:String,
//         required:true
//     },
//     // martialStatus:{
//     //     type:String,
//     // },
//      dob:{
//         type:String,
//         required:true
//     },
//     userType:{
//         type:String,
//         required:true
//     },
//     description:{
//       type:String
//     },
//      password: {
//         type: String,
//         required: true
//     },
//     address: {
//         state: String,
//         district: String,
//          city: String,
//         pincode: String,
//     geoLocation: {
//       type: {
//         type: String,
//         enum: ['Point'],
//         default: 'Point'
//       },
//       coordinates: {
//         type: [Number], // [longitude, latitude]
//         index: '2dsphere'
//       }
//     }
//     },
//     details:{
   
//    },
//     mobileNumber:{
//         type:String,
//         required:true
//     },
//    email:{
//     type:String,
//     required:true
//     },
//     location:{
//     type:String
//   },
//     image:[{
//     type:String
//   }],
//     certificates: [{ type: String }], 
//     logoImage: [{ type: String }], 

//     adminDetails:{
//       isAdmin:{
//         type:Boolean,
//         default:false
//       },
//     adminId:{type:String},
//     branch:[{type:Array}]
//     },
//   isActive:{
//     type:Boolean,
//     default:true
//   },
//   createdDate:{
//     type:Date,
//     default:Date.now
//   },
//   updatedDate:{
//     type:Date,
//     default:Date.now
//   },
  

// })

// module.exports=mongoose.model('user',userModel)


const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  dob: {
    type: String,
    required: true
  },
  userType: {
    type: String,
    required: true
  },
  description: String,
  password: {
    type: String,
    required: true
  },

  address: {
    state: String,
    district: String,
    city: String,
    area:String,
    pincode: String,

    geoLocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        required: true
      }
    }
  },

  details: Object,

  mobileNumber: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  },

isEmailVerified: {
  type: Boolean,
  default: false
},
  location: String,

  image: [String],
  certificates: [String],
  logoImage: [String],

  adminDetails: {
    isAdmin: {
      type: Boolean,
      default: false
    },
    adminId: String,
    branch: [{ type: Array }]
  },

  isActive: {
    type: Boolean,
    default: true
  },

  createdDate: {
    type: Date,
    default: Date.now
  },

  updatedDate: {
    type: Date,
    default: Date.now
  }
});
userSchema.index({ "address.geoLocation": "2dsphere" });
module.exports = mongoose.model('user', userSchema);
