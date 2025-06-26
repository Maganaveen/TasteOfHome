const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  itemId: Number,
  itemName: String,
  quantity: Number,
  price: Number,
  total: Number,
  discount: Number,
  paymentMethod: String,
  customerName: String,
  phone: String,
  address: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Order', orderSchema);
