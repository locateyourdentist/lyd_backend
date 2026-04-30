const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  state: String,
  district: String,
  subDistrict: String,
  village: String
});

module.exports = mongoose.model("location", locationSchema);