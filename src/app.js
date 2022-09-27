const User = require("./models/user_model");
const Account = require("./models/account_model");
const Transaction = require("./models/transaction_model");

const express = require("express");

const app = express();
const port = process.env.PORT || 4000;
var cors = require("cors");
app.use(cors());

require("./db/conn");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(port, () => {
  console.log(`server is on ${port}`);
});

// signup
app.post("/signup", async (req, res) => {
  try {
    console.log(req.body);
    var name = req.body.name;
    var email = req.body.email;
    var pass = req.body.password;
    const registerUser = new User({
      name: name,
      email: email,
      password: pass,
    });
    const registered = await registerUser.save();

    // res.json({ success: "Updated Successfully", status: 200 });
    //account create
    const account = new Account({
      number:
        Math.random().toString(36).slice(3) +
        Math.random().toString(36).slice(5),
      user: registered._id,
    });
    const accountCreated = await account.save();

    // const account = await Account.findOne({ user: useremail._id });

    res.json({
      data: {
        account_num: account.number,
        balance: account.balance,
        name: name,
        email: email,
        isAdmin: false,
      },
      status: 200,
    });
    return res;
  } catch (err) {
    res.status(400).send(err);
  }
});

//login
app.post("/login", async (req, res) => {
  try {
    var email = req.body.email;
    var pass = req.body.pass;
    const useremail = await User.findOne({ email: email });
    console.log(useremail);
    console.log(pass, useremail.password);
    if (useremail.password === pass) {
      const account = await Account.findOne({ user: useremail._id });
      if (useremail.isAdmin) {
        res.json({
          data: {
            name: useremail.name,
            email: useremail.email,
            isAdmin: useremail.isAdmin,
          },
          status: 200,
        });
      } else {
        res.json({
          data: {
            account_num: account.number,
            balance: account.balance,
            name: useremail.name,
            email: useremail.email,
            isAdmin: useremail.isAdmin,
          },
          status: 200,
        });
      }

      return res;
    } else {
      res.json({ success: "login failed", status: 400 });
      return res;
    }
  } catch (err) {
    res.status(400).send(err);
  }
});
//user data

//transaction
app.post("/transaction", async (req, res) => {
  try {
    console.log(res.body);
    var from = req.body.from;
    var to = req.body.to;
    var amount = parseInt(req.body.amount);
    const fromAcc = await Account.findOne({ number: from });
    const toAcc = await Account.findOne({ number: to });
    const transaction = new Transaction({
      from: fromAcc._id,
      to: toAcc._id,
      amount: amount,
    });
    console.log(transaction);
    const transactionCreated = await transaction.save();
    console.log(fromAcc.balance);
    console.log(amount);
    const updatebal1 = {
      $set: {
        balance: fromAcc.balance - amount,
      },
    };

    const updatebal2 = {
      $set: {
        balance: toAcc.balance + amount,
      },
    };
    const update1 = await Account.updateOne({ _id: fromAcc._id }, updatebal1);
    const update2 = await Account.updateOne({ _id: toAcc._id }, updatebal2);

    res.json({ success: "transaction Successfully", status: 200 });
    return res;
  } catch (err) {
    res.status(400).send(err);
  }
});

app.get("/userlist", async (req, res) => {
  try {
    const account = await Account.find().populate("user");

    // const account = await Account.find();
    var data = [];
    for (var i = 0; i < account.length; i++) {
      if (account[i].user.isAdmin == true) continue;
      data.push({
        name: account[i].user.name,
        email: account[i].user.email,
        account_num: account[i].number,
        balance: account[i].balance,
      });
    }
    res.json({ data: data, status: 200 });
    return res;
  } catch (err) {
    res.status(400).send(err);
  }
});

// transaction list : from,to,amount,date
app.get("/transactionlist/:acc_num", async (req, res) => {
  try {
    const acc_num = req.params.acc_num;
    const account = await Account.findOne({ number: acc_num });
    const transaction = await Transaction.find({
      $or: [{ from: account._id }, { to: account._id }],
    });
    var data = [];
    for (var i = 0; i < transaction.length; i++) {
      const fromAcc = await Account.findOne({ _id: transaction[i].from });
      const toAcc = await Account.findOne({ _id: transaction[i].to });
      data.push({
        from: fromAcc.number,
        to: toAcc.number,
        amount: transaction[i].amount,
        date: transaction[i].date,
      });
    }
    res.json({ data: data, status: 200 });
    return res;
  } catch (err) {
    res.status(400).send(err);
  }
});

// total amnt in bank & total user
app.get("/total", async (req, res) => {
  try {
    const account = await Account.find();
    var total = 0;
    for (var i = 0; i < account.length; i++) {
      total = total + account[i].balance;
    }
    const users = await User.find();
    res.json({ total: total, users: users.length, status: 200 });
    return res;
  } catch (err) {
    res.status(400).send(err);
  }
});

// credit/debit: accNum,amount
app.post("/update/:what", async (req, res) => {
  try {
    const what = req.params.what;

    var acc_num = req.body.acc_num;
    var amount = parseInt(req.body.amount);
    const account = await Account.findOne({ number: acc_num });
    let updatebal;
    if (what === "credit") {
      updatebal = {
        $set: {
          balance: account.balance + amount,
        },
      };
    } else {
      updatebal = {
        $set: {
          balance: account.balance - amount,
        },
      };
    }
    const update = await Account.updateOne({ _id: account._id }, updatebal);
    res.json({ success: "Updated Successfully", status: 200 });
    return res;
  } catch (err) {
    res.status(400).send(err);
  }
});
