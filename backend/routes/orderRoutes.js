const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const path = require('path');

// Function to generate random order ID
const generateOrderId = () => {
  const prefix = 'TOH';
  const randomNum = Math.floor(100000 + Math.random() * 900000); // 6-digit random number
  return `${prefix}${randomNum}`;
};

// Function to send order confirmation email
const sendOrderConfirmationEmail = async (userEmail, userName, orderId, orderDetails) => {
  try {
    console.log('🔄 Attempting to send email to:', userEmail);
    console.log('📧 Email config:', {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS ? '***configured***' : 'NOT SET'
    });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Test the connection
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully');

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `Order Confirmation - ${orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ff6347;">Hello ${userName},</h2>
          <p>🎉 Thank you for your order with <strong>Taste of Home</strong>!</p>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #ff6347; margin-top: 0;">Order Details</h3>
            <p><strong>Order ID:</strong> ${orderId}</p>
            <p><strong>Item:</strong> ${orderDetails.itemName}</p>
            <p><strong>Quantity:</strong> ${orderDetails.quantity}</p>
            <p><strong>Total Amount:</strong> ₹${orderDetails.total}</p>
            <p><strong>Payment Method:</strong> ${orderDetails.paymentMethod}</p>
            <p><strong>Delivery Address:</strong> ${orderDetails.address}</p>
          </div>
          
          <p>Your order has been confirmed and is being prepared with love and care. 🍽️</p>
          <p>You can track your order status using the Order ID: <strong>${orderId}</strong></p>
          
          <p>Thank you for choosing Taste of Home!</p>
          <p>— Team Taste of Home</p>
        </div>
      `,
    };

    console.log('📤 Sending email with options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });

    const result = await transporter.sendMail(mailOptions);
    console.log('📧 Order confirmation email sent successfully:', {
      messageId: result.messageId,
      to: userEmail,
      orderId: orderId
    });
    return true;
  } catch (error) {
    console.error('❌ Failed to send order confirmation email:', {
      error: error.message,
      code: error.code,
      command: error.command,
      userEmail: userEmail,
      orderId: orderId
    });
    return false;
  }
};

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded; // Contains { id, name, email }
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};

// POST - Create new order
router.post('/orders', verifyToken, async (req, res) => {
  try {
    // Generate unique order ID
    let orderId;
    let isUnique = false;
    
    // Ensure order ID is unique
    while (!isUnique) {
      orderId = generateOrderId();
      const existingOrder = await Order.findOne({ orderId });
      if (!existingOrder) {
        isUnique = true;
      }
    }

    const orderData = {
      ...req.body,
      orderId: orderId,
      userId: req.user.id,
      customerName: req.body.customerName || req.user.name
    };
    
    const order = new Order(orderData);
    await order.save();

    // Get user details for email
    console.log('🔍 Looking for user with ID:', req.user.id);
    const user = await User.findById(req.user.id);
    console.log('👤 User found:', user ? { name: user.name, email: user.email } : 'No user found');
    
    if (user) {
      console.log('📋 Order details for email:', {
        itemName: orderData.itemName,
        quantity: orderData.quantity,
        total: orderData.total,
        paymentMethod: orderData.paymentMethod,
        address: orderData.address
      });

      // Send order confirmation email
      const emailSent = await sendOrderConfirmationEmail(
        user.email,
        user.name,
        orderId,
        {
          itemName: orderData.itemName,
          quantity: orderData.quantity,
          total: orderData.total,
          paymentMethod: orderData.paymentMethod,
          address: orderData.address
        }
      );

      if (!emailSent) {
        console.log('⚠️ Order created but email notification failed');
      } else {
        console.log('✅ Order created and email sent successfully');
      }
    } else {
      console.log('❌ User not found, cannot send email');
    }

    res.status(201).json({ 
      message: 'Order placed successfully',
      orderId: orderId,
      mongoId: order._id 
    });
  } catch (err) {
    console.error('❌ Order creation error:', err);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

// GET - Fetch user's orders
router.get('/orders', verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// GET - Fetch specific order by ID (supports both custom orderId and MongoDB _id)
router.get('/orders/:orderId', verifyToken, async (req, res) => {
  try {
    const searchId = req.params.orderId;
    let order;

    // Try to find by custom orderId first, then by MongoDB _id
    if (searchId.startsWith('TOH')) {
      order = await Order.findOne({ 
        orderId: searchId, 
        userId: req.user.id 
      });
    } else {
      order = await Order.findOne({ 
        _id: searchId, 
        userId: req.user.id 
      });
    }
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// PUT - Update order status
router.put('/orders/:orderId/status', verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Confirmed', 'Preparing', 'Out for delivery', 'Delivered'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const searchId = req.params.orderId;
    let order;

    // Try to find by custom orderId first, then by MongoDB _id
    if (searchId.startsWith('TOH')) {
      order = await Order.findOne({ 
        orderId: searchId, 
        userId: req.user.id 
      });
    } else {
      order = await Order.findOne({ 
        _id: searchId, 
        userId: req.user.id 
      });
    }
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // Add new status to history
    order.statusHistory.push({
      status: status,
      timestamp: new Date()
    });
    
    await order.save();
    res.json({ 
      message: 'Order status updated successfully',
      order: order 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Debug route to check user data
router.get('/debug-user', verifyToken, async (req, res) => {
  try {
    console.log('🔍 Debug: JWT payload:', req.user);
    const user = await User.findById(req.user.id);
    console.log('👤 Debug: User from DB:', user);
    
    res.json({
      jwtPayload: req.user,
      userFromDB: user,
      userExists: !!user
    });
  } catch (error) {
    console.error('❌ Debug error:', error);
    res.status(500).json({ error: 'Debug failed', details: error.message });
  }
});

// Test route to verify email functionality
router.post('/test-email', verifyToken, async (req, res) => {
  try {
    console.log('🧪 Testing email functionality...');
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const testOrderId = generateOrderId();
    const emailSent = await sendOrderConfirmationEmail(
      user.email,
      user.name,
      testOrderId,
      {
        itemName: 'Test Item',
        quantity: 1,
        total: 100,
        paymentMethod: 'Test Payment',
        address: 'Test Address'
      }
    );

    res.json({
      message: emailSent ? 'Test email sent successfully' : 'Failed to send test email',
      userEmail: user.email,
      orderId: testOrderId,
      success: emailSent
    });
  } catch (error) {
    console.error('❌ Test email error:', error);
    res.status(500).json({ error: 'Test email failed', details: error.message });
  }
});

// Simple email test route
router.post('/simple-email-test', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    console.log('📧 Testing simple email to:', email);
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Test Email from Taste of Home',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #ff6347;">Test Email</h2>
          <p>This is a test email to verify the email functionality is working.</p>
          <p>If you receive this, the email system is configured correctly!</p>
          <p>— Team Taste of Home</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Simple test email sent successfully');
    
    res.json({ message: 'Test email sent successfully', to: email });
  } catch (error) {
    console.error('❌ Simple email test failed:', error);
    res.status(500).json({ error: 'Failed to send test email', details: error.message });
  }
});

module.exports = router;
