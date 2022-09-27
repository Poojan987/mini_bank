const mongoose = require("mongoose"); // Erase if already required
const account_schema = new mongoose.Schema({
  number: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  balance: { type: Number, default: 10000 },
});

module.exports = mongoose.model("Account", account_schema);
