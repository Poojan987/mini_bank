const mongoose = require("mongoose"); // Erase if already required
const transaction_schema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
  to: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Transaction", transaction_schema);
