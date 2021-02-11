const express = require("express");
const Cart    = require("../models/carts");
const Product = require("../models/products");

const router  = express.Router();

router.post("/cart/products", async (req, res) => {
  let cart;
  if(!req.session.cartId) {
    cart = await new Cart();
    req.session.cartId = cart._id;
  } else {
    cart = await Cart.findOne({_id: req.session.cartId});
  }
  
  const existingItem = cart.items.find(item => item.id == req.body.productId);
  if(existingItem) {
    existingItem.quantity++;
  } else {
  cart.items.push({id: req.body.productId, quantity: 1})
  }
  await cart.save();
  
  res.redirect("/cart");
});

router.get("/cart", async (req,res) => {

  if(!req.session.cartId) {
    res.render("carts", {items: ""});
  } else {
  const cart = await Cart.findOne({_id: req.session.cartId});

  for (let item of cart.items) {
    const product = await Product.findOne({_id: item.id});
    item.product = product; 
  }
  res.render("carts", {items: cart.items});
}
});

router.post("/products/delete/:id", async (req, res) => {
  const itemId = req.params.id;
  const cart = await Cart.findOne({_id: req.session.cartId});

  const items = cart.items.filter(item => item.id != itemId);
  cart.items = items;
  cart.save();
  res.redirect("/cart");
});




module.exports = router;