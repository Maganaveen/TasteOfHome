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
const MealPlan = require('./models/MealPlan');
const twilio = require('twilio');
const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
const cron = require('node-cron');


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


cron.schedule('*/30 * * * *', async () => {
  try {
    const message = '🛍️ Local Test: Festival Offer from Taste of Home! 30% OFF on all meals.';

    const users = await User.find({}, 'phoneNumber');

    for (const user of users) {
      const formattedNumber = `+91${user.phoneNumber}`;
      await twilioClient.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE,
        to: formattedNumber,
      });
    }

    console.log(`[${new Date().toLocaleString()}] ✅ Cron: Sent SMS to all users.`);
  } catch (error) {
    console.error('❌ Cron Error:', error.message);
  }
});


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

// Get saved cart for logged-in user
app.get('/api/cart', authenticate, async (req, res) => {
  try {
    const userCart = await Cart.findOne({ userId: req.user.id });
    if (!userCart) {
      return res.status(200).json({ items: [] }); // empty cart
    }
    res.status(200).json(userCart);
  } catch (error) {
    console.error('❌ Fetch cart error:', error);
    res.status(500).json({ message: 'Failed to fetch cart' });
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


app.post('/api/mealplan/save', authenticate, async (req, res) => {
  try {
    const { mealPlan, weeklyTotal } = req.body;

    if (!Array.isArray(mealPlan) || typeof weeklyTotal !== 'number') {
      return res.status(400).json({ message: 'Invalid meal plan data' });
    }

    const newMealPlan = new MealPlan({
      userId: req.user.id,
      mealPlan,
      weeklyTotal
    });

    await newMealPlan.save();
    // res.status(201).json({ message: 'Meal plan saved successfully' });
    toastr.success('Meal plan saved successfully', '', { timeOut: 3000 })
  } catch (error) {
    console.error('❌ Meal plan save error:', error);
    // res.status(500).json({ message: 'Failed to save meal plan' });
    toastr.error('Failed to save meal plan', '', { timeOut: 3000 })
  }
});



app.get('/api/mealplan/history', authenticate, async (req, res) => {
  try {
    const history = await MealPlan.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(history);
  } catch (error) {
    console.error('❌ Fetch history error:', error);
    res.status(500).json({ message: 'Failed to fetch meal plan history' });
  }
});

app.post('/api/notify-offers', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: 'Message is required' });

    const users = await User.find({}, 'phoneNumber');

    let successCount = 0;
    let failedNumbers = [];

    for (const user of users) {
      const formattedNumber = `+91${user.phoneNumber}`;
      try {
        await twilioClient.messages.create({
          body: message,
          from: process.env.TWILIO_PHONE,
          to: formattedNumber,
        });
        successCount++;
      } catch (err) {
  console.error(`❌ Failed to send to ${formattedNumber}:`, err.message);
  failedNumbers.push({ number: formattedNumber, error: err.message });
}

    }

    res.status(200).json({
      message: `Offers sent to ${successCount} users`,
      failedNumbers,
    });

  } catch (error) {
    console.error('❌ Notification error (outer catch):', error);
    res.status(500).json({ message: 'Failed to send notifications' });
  }
});



// Server Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
