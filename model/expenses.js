const mongoose = require('mongoose');


const expenseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, default: "General" },
  state:{type:String,},
  userId: { type: String, required: true },
  createdDate: { type: Date,default:Date.now}, 
  month: { type: Number }, 
  year: { type: Number },
  updatedDate: { type: Date, default: Date.now },
});

// expenseSchema.pre('save', function (next) {
//   if (!this.month) this.month = this.createdDate.getMonth() + 1;
//   if (!this.year) this.year = this.createdDate.getFullYear();
//   next();
// });

module.exports = mongoose.model('Expense', expenseSchema);
