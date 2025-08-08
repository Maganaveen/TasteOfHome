const mongoose = require('mongoose');

const orderStatusSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['Confirmed', 'Preparing', 'Out for delivery', 'Delivered'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
    required: true
  },
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
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  statusHistory: {
    type: [orderStatusSchema],
    default: function() {
      return [{
        status: 'Confirmed',
        timestamp: new Date()
      }];
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Order', orderSchema);
