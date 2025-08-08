const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: function() { return this.authProvider !== 'google'; } },
  phoneNumber: { type: String, required: false },
  googleId: { type: String, unique: true, sparse: true },
  avatar: { type: String, default: '' },
  authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
  isLoggedIn: { type: Boolean, default: false },
  lastLoginAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('User', userSchema);
