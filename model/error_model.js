
const mongoose = require("mongoose");

const errorLogSchema = new mongoose.Schema(
  {
    message: String,
    stack: String,
    method: String,
    url: String,
    body: Object,
    params: Object,
    query: Object,
    headers: Object,
    user: String,
    ip: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("ErrorLog", errorLogSchema);