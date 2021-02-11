const {check} = require("express-validator");
const User = require("../../models/users");
const Product = require("../../models/products");

module.exports = {
  requireCompanyName: check("name")
  .trim()
  .isLength({min: 1})
  .withMessage("This field cannot be blank"),
  requireName: check("name")
  .trim()
  .isLength({min: 3, max: 40})
  .withMessage("Must be between 3 and 40 characters"),
  requirePrice: check("price")
  .trim()
  .toFloat()
  .isFloat({min: 1})
  .withMessage("Must be a number greater than 1"),
  requireImage: check("image")
  .custom((value, {req}) => {
    if(!req.file) {
      throw new Error("Please upload an image");
    } else {
      return true;
    }
  }),
  requireEmail: check('email')
  .trim()
  .normalizeEmail()
  .isEmail()
  .withMessage("Must be a valid email")
  .custom(async (email) => {
    const existingUser = await User.find({email:email});
    if(existingUser.length > 0){
    throw new Error('Email in use');
    }
  }),
  requirePassword: check('password')
  .trim()
  .isLength({min: 4, max:12})
  .withMessage("Password needs to be between 4 and 12 characters long"),  
  requireConfirmPassword: check('confirmPassword')
  .trim()
  .custom(async (confirmPassword, {req}) => {
    if(confirmPassword !== req.body.password) {
      throw new Error("Passwords do not match");
    }  
  })
}