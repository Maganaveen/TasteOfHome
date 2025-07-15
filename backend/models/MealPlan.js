const mongoose = require('mongoose');

const DishPlanSchema = new mongoose.Schema({
  day: String,
  breakfast: String,
  lunch: String,
  dinner: String,
  totalForDay: Number
});

const MealPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mealPlan: [DishPlanSchema],
  weeklyTotal: Number,
  createdAt: {
    type: Date,
    default: Date.now   
  }
});

module.exports = mongoose.model('MealPlan', MealPlanSchema);
