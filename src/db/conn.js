const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost:27017/bank", {
    dbName: "bank",
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    // useCreateIndex: true,
  })
  .then(() => {
    console.log("connection sucess");
  })
  .catch(() => {
    console.log("unsuccess");
  });
