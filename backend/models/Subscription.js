const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  canteen: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Canteen',
    required: true,
  },
  plan: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'breakfast_lunch', 'lunch_dinner', 'all_meals'],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'cancelled', 'expired'],
    default: 'active',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending',
  },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  mealsConsumed: {
    type: Number,
    default: 0,
  },
  autoRenew: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

// Index for efficient queries
subscriptionSchema.index({ tenant: 1, status: 1 });
subscriptionSchema.index({ canteen: 1, status: 1 });

module.exports = mongoose.model('Subscription', subscriptionSchema);
