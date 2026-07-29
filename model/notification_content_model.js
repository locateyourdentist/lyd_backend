const mongoose = require('mongoose');

const notificationContentSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true
  },
  label: {
    type: String
  },
  emailSubject: {
    type: String
  },
  title: {
    type: String
  },
  message: {
    type: String
  },
  whatsappTemplateName: {
    type: String
  },
  whatsappLanguageCode: {
    type: String,
    default: 'en_US'
  },
  whatsappVariables: [{
    type: String
  }],
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

module.exports = mongoose.model('notificationContent', notificationContentSchema);
