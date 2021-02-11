const express = require("express");
const Product = require("../../models/products");

const router  = express.Router();

router.get("/home", async (req,res) => {
  const result = await Product.find();
  res.render("customer/home", {result: result});
});








module.exports = router;