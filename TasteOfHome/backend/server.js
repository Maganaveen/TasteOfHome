const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Models
const User = require('./models/User');
const Order = require('./models/order');
const CartCount = require('./models/CartCount');
const Cart = require('./models/cart');

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch((error) => console.error('❌ MongoDB connection error:', error));


// const cartCountSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//     unique: true,
//   },
//   count: {
//     type: Number,
//     required: true,
//     default: 0,
//   },
// });

// module.exports = mongoose.model('CartCount', cartCountSchema);

// JWT Authentication Middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Contains { id, name, email }
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Register Route
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, phoneNumber } = req.body;

    if (!name || !email || !password || !phoneNumber) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    if (!/^[0-9]{10}$/.test(phoneNumber)) {
      return res.status(400).json({ message: 'Invalid phone number' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, phoneNumber });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login Route
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    // console.error('❌ Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Order Submission Route (Authenticated)
app.post('/api/orders', authenticate, async (req, res) => {
  try {
    const { itemId, itemName, quantity, price, total, discount, paymentMethod, phone, address } = req.body;

    if (!itemName || !quantity || !paymentMethod || !phone || !address) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newOrder = new Order({
      itemId,
      itemName,
      quantity,
      price,
      total,
      discount,
      paymentMethod,
      customerName: req.user.name, // ✅ Get name from token
      phone,
      address,
    });

    await newOrder.save();
    res.status(201).json({ message: 'Order placed successfully' });
  } catch (error) {
    // console.error('❌ Order error:', error);
    res.status(500).json({ message: 'Failed to place order' });
  }
});
app.post('/api/cart/count', async (req, res) => {
  const { userId, count } = req.body;

  if (!userId || typeof count !== 'number') {
    return res.status(400).json({ message: 'Invalid request' });
  }

  try {
    await CartCount.findOneAndUpdate(
      { userId },
      { count },
      { upsert: true, new: true }
    );
    res.status(200).json({ message: 'Cart count updated' });
  } catch (error) {
    console.error('❌ Cart count update error:', error);
    res.status(500).json({ message: 'Failed to update cart count' });
  }
});
app.post('/api/cart/save', authenticate, async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Cart items required' });
    }

    // Save or update cart for user
    const updatedCart = await Cart.findOneAndUpdate(
      { userId: req.user.id },
      { $set: { items } },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: 'Cart saved successfully', cart: updatedCart });
  } catch (error) {
    console.error('❌ Cart save error:', error);
    res.status(500).json({ message: 'Failed to save cart' });
  }
});

// Server Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
