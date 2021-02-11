const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  wear: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true
  },
  description: {
    type:String,
    required: false,
  }

});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;