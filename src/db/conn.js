const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

// process.env.DATABASE
const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);
// const DB = process.env.DATABASE;
mongoose
  .connect(DB, {
    dbName: "bank",
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    // useCreateIndex: true,
  })
  .then(() => {
    console.log("connection sucess");
  })
  .catch((e) => {
    console.log(e);
    console.log("unsuccess");
  });
