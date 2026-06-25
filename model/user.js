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
     addressLine1: {
      type: String,
    },

    addressLine2: {
      type: String,
    },
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
