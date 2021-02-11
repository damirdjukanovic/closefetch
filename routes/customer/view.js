const express = require("express");
const Product = require("../../models/products");
const User    = require("../../models/users");


const router  = express.Router();

router.get("/view/:id", async (req, res) => {
  const product = await Product.findOne({"_id": req.params.id});
  res.render("products/view", {product: product});
});


module.exports = router;