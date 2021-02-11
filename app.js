const express        = require("express");
const bodyParser     = require("body-parser");
const mongoose       = require("mongoose");
const cookieSession  = require("cookie-session");
const flash          = require("connect-flash");
const authRouter     = require("./routes/admin/auth");
const productsRouter = require("./routes/admin/products/products");
const cartsRouter    = require("./routes/carts");
const customerRouter = require("./routes/customer/customer");
const viewRouter     = require("./routes/customer/view");

const app = express();
app.set('view engine', 'ejs');

app.use(flash());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
const dbUrl = "mongodb+srv://dakopako:kakotako@cluster0.3wnno.mongodb.net/pik?retryWrites=true&w=majority";

app.use(cookieSession({
  keys: ['lklkjlkasdlkjaljkskl2as2']
}));
app.use(function(req, res, next) {
  res.locals.messageError = req.flash("messageError");
  res.locals.messageSuccess = req.flash("messageSuccess");
  next();
});
app.use(authRouter);
app.use(productsRouter);
app.use(cartsRouter);
app.use(customerRouter);
app.use(viewRouter);

mongoose.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true})
  .then((result) => { 
    app.listen(4000, () => {
    console.log("SERVER STARTED");
    });
  })
  .catch((err) => console.log(err));





app.get("/", (req, res) => {
  res.render("customer/landing");
});


