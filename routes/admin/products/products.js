const express = require("express");
const { check, validationResult } = require("express-validator");
const multer = require("multer");
const {requireName, requirePrice, requireImage} = require("../validators");
const User = require("../../../models/users");
const Product = require("../../../models/products");
const { isLoggedIn } = require("../middlewares");

const router = express.Router();
const upload = multer({storage: multer.memoryStorage()});

//CREATE PRODUCT
router.get("/createproduct",  isLoggedIn, (req, res) => {
  const errors = validationResult(req);
  res.render("admin/createproduct", {errors:errors});
});

router.post("/createproduct", 
  upload.single("image"),
  [requireName, requirePrice, requireImage],  
  async (req, res) => {
  const errors = validationResult(req);

    if(!errors.isEmpty()){
      return res.render("admin/createproduct", {errors:errors});
    }
    const image = req.file.buffer.toString("base64");
    const {name, price, wear, gender} = req.body;

  const product = await new Product({name, price, image, wear, gender});
  console.log(product);
  const user = await User.findOne({"_id": req.session.userId});
  console.log(user);

  user.products.push({"id": product._id});
  await user.save();
  await product.save();
  
  console.log(user);
  res.redirect("/products");
})

router.get("/products", isLoggedIn, async (req,res) => {
  const user = await User.findOne({"_id": req.session.userId});
  console.log(user);
    Product.find()
      .then((result) => {
        res.render("index", {result: result, user: user});
      })
      .catch((err) => {
        console.log(err);
      });
});

//VIEW PRODUCT
router.get("/products/view/:id", async (req, res) => {
  const product = await Product.findOne({_id: req.params.id});
  res.render("products/product", {product: product});
});

//EDIT PRODUCT
router.get("/product/:id/edit", isLoggedIn, async (req, res) => {
  const errors = validationResult(req);
  const product = await Product.findOne({_id: req.params.id});

  res.render("admin/editproduct", {product: product, errors: errors});
});

router.post("/product/:id/edit",
  upload.single("image"),
  [requireName, requirePrice], 
  async (req, res) => {
    const errors = validationResult(req);
    let product = await Product.findOne({_id: req.params.id});
    
    if(!errors.isEmpty()){
      return res.render("admin/editproduct", {errors:errors, product: product});
    }
    
    if(req.file){
      product.image = req.file.buffer.toString("base64");
    }
    product.name  = req.body.name;
    product.price = req.body.price;
    product.save();
    res.redirect("/products");
});

//DELETE PRODUCT
router.post("/product/:id/delete", isLoggedIn, async (req, res) => {
  await Product.findByIdAndRemove(req.params.id);

  res.send("Product deleted");
});

module.exports = router;