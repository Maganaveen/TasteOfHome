const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const path = require('path');

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
mongoose.connect(process.env.MONGODB_URI)
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


// Helper function to send both SMS and WhatsApp
async function sendBothMessages(phoneNumber, message) {
  const formattedNumber = `+91${phoneNumber}`;
  const results = { sms: null, whatsapp: null };

  // Send SMS
  try {
    console.log(`📤 Sending SMS to: ${formattedNumber}`);
    const smsResult = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE,
      to: formattedNumber,
    });
    results.sms = { success: true, sid: smsResult.sid };
    console.log(`✅ SMS sent successfully to: ${formattedNumber}`);
  } catch (smsError) {
    results.sms = { success: false, error: smsError.message };
    console.error(`❌ Failed to send SMS to ${formattedNumber}:`, smsError.message);
  }

  // Send WhatsApp
  try {
    console.log(`📤 Sending WhatsApp to: ${formattedNumber}`);
    const whatsappResult = await twilioClient.messages.create({
      body: message,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP}`,
      to: `whatsapp:${formattedNumber}`,
    });
    results.whatsapp = { success: true, sid: whatsappResult.sid };
    console.log(`✅ WhatsApp sent successfully to: ${formattedNumber}`);
  } catch (whatsappError) {
    results.whatsapp = { success: false, error: whatsappError.message };
    console.error(`❌ Failed to send WhatsApp to ${formattedNumber}:`, whatsappError.message);
  }

  return results;
}

cron.schedule('*/45 * * * *', async () => {
  try {
    const message = '🛍️ Special Deal: 30% OFF only for active users! Taste of Home.';

    const users = await User.find({ 
      isLoggedIn: true, 
      phoneNumber: { $exists: true, $ne: null, $ne: '' } 
    }, 'phoneNumber');

    // console.log(`[${new Date().toLocaleString()}] 📱 Found ${users.length} logged-in users with phone numbers.`);

    if (users.length === 0) {
      // console.log(`[${new Date().toLocaleString()}] ℹ️ No logged-in users with phone numbers found.`);
      return;
    }

    let smsSuccessCount = 0;
    let whatsappSuccessCount = 0;
    let smsFailedCount = 0;
    let whatsappFailedCount = 0;

    for (const user of users) {
      const results = await sendBothMessages(user.phoneNumber, message);
      
      if (results.sms.success) smsSuccessCount++;
      else smsFailedCount++;
      
      if (results.whatsapp.success) whatsappSuccessCount++;
      else whatsappFailedCount++;
    }

    // console.log(`[${new Date().toLocaleString()}] ✅ Cron Summary:`);
    // console.log(`  📱 SMS: ${smsSuccessCount} sent, ${smsFailedCount} failed`);
    // console.log(`  💬 WhatsApp: ${whatsappSuccessCount} sent, ${whatsappFailedCount} failed`);
  } catch (error) {
    // console.error('❌ Cron Error:', error.message);
  }
});



// Register Route
const nodemailer = require('nodemailer');

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

  
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      // nodemailer code...
    }
    
    if (userCount != 0) {
      // console.log("✅ First user detected, preparing to send welcome email...");
      
      // Send welcome email to the first user
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      console.log(transporter);
      

     const mailOptions = {
      from: 'mytasteofhome24@gmail.com',
      to: email,
      subject: 'Welcome to Taste of Home!',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #ff6347;">Hello ${name},</h2>
          <p>🎉 We're thrilled to welcome you to <strong>Taste of Home</strong>!</p>
          <p>Get ready to embark on a culinary journey with us. Enjoy delicious homemade meals, crafted just for you, with love and care.</p>
          <img src="cid:welcomeImage" alt="Welcome to Taste of Home" style="width:100%; max-width:600px; margin: 20px 0;" />
          <p>We hope you enjoy every bite and savor every moment. 🍽️</p>
          <p>Bon Appétit!</p>
          <p>— Team Taste of Home</p>
        </div>
      `,
      attachments: [{
        filename: 'welcome.jpg',
        path: path.join(__dirname, '../public/orange.jpg'),
        cid: 'welcomeImage' // Same CID as in the html img src
      }]
    };


      await transporter.sendMail(mailOptions);
      console.log('📧 Welcome email sent to the first user:', email);
    }

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

    // Update user login status
    await User.findByIdAndUpdate(user._id, {
      isLoggedIn: true,
      lastLoginAt: new Date()
    });

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // ✅ Return token + user data (name & avatar)
    res.json({
      token,
      user: {
        name: user.name,
        avatar: user.avatar || "", // fallback if no avatar is stored
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Logout Route
app.post('/api/logout', authenticate, async (req, res) => {
  try {
    // Set user as logged out
    await User.findByIdAndUpdate(req.user.id, {
      isLoggedIn: false
    });

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('❌ Logout error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Import and use order routes
const orderRoutes = require('./routes/orderRoutes');
app.use('/api', orderRoutes);
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
    res.status(201).json({ message: 'Meal plan saved successfully' });
  } catch (error) {
    console.error('❌ Meal plan save error:', error);
    res.status(500).json({ message: 'Failed to save meal plan' });
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

    const users = await User.find({ 
      isLoggedIn: true, 
      phoneNumber: { $exists: true, $ne: null, $ne: '' } 
    }, 'phoneNumber');

    let smsSuccessCount = 0;
    let whatsappSuccessCount = 0;
    let failedNumbers = [];

    for (const user of users) {
      const results = await sendBothMessages(user.phoneNumber, message);
      
      if (results.sms.success) {
        smsSuccessCount++;
      } else {
        failedNumbers.push({ 
          number: `+91${user.phoneNumber}`, 
          type: 'SMS',
          error: results.sms.error 
        });
      }
      
      if (results.whatsapp.success) {
        whatsappSuccessCount++;
      } else {
        failedNumbers.push({ 
          number: `+91${user.phoneNumber}`, 
          type: 'WhatsApp',
          error: results.whatsapp.error 
        });
      }
    }

    res.status(200).json({
      message: `Messages sent - SMS: ${smsSuccessCount}, WhatsApp: ${whatsappSuccessCount}`,
      summary: {
        sms: { success: smsSuccessCount, failed: failedNumbers.filter(f => f.type === 'SMS').length },
        whatsapp: { success: whatsappSuccessCount, failed: failedNumbers.filter(f => f.type === 'WhatsApp').length }
      },
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
