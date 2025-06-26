const mongoose = require('mongoose');

const cartCountSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  count: {
    type: Number,
    required: true,
  },
});

// ✅ Prevent model overwrite issue
module.exports = mongoose.models.CartCount || mongoose.model('CartCount', cartCountSchema);
