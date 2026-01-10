import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Allow guest bookings if needed, though frontend currently requires auth for dashboard
  },
  customerName: {
    type: String,
    required: true
  },
  customerPhone: {
    type: String,
    required: true
  },
  customerAddress: {
    type: String,
    required: true
  },
  bookingType: {
    type: String,
    enum: ['SERVICE', 'AMC', 'PURCHASE'],
    default: 'SERVICE'
  },
  serviceId: {
    type: String
  },
  planId: {
    type: String
  },
  purchaseDetails: {
    brands: [String],
    tonnage: String,
    budget: String
  },
  date: {
    type: String,
    required: false // Not required for PURCHASE
  },
  time: {
    type: String,
    required: false // Not required for PURCHASE
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  acType: {
    type: String,
    enum: ['Split', 'Window', 'Cassette', 'Tower', 'Other'],
    default: 'Split'
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Transform _id to id in JSON response
bookingSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  }
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;