import express from 'express';
import Booking from '../models/Booking.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// @desc    Create a new booking
// @route   POST /api/bookings
router.post('/', protect, async (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      customerAddress,
      bookingType,
      serviceId,
      planId,
      purchaseDetails,
      date,
      time,
      acType,
      notes
    } = req.body;

    const booking = new Booking({
      userId: req.user._id,
      customerName,
      customerPhone,
      customerAddress,
      bookingType: bookingType || 'SERVICE',
      serviceId,
      planId,
      purchaseDetails,
      date,
      time,
      acType,
      notes,
      status: 'Pending'
    });

    const createdBooking = await booking.save();
    res.status(201).json(createdBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all bookings (Admin sees all, User sees theirs)
// @route   GET /api/bookings
router.get('/', protect, async (req, res) => {
  try {
    let bookings;
    if (req.user.role === 'ADMIN') {
      bookings = await Booking.find({}).sort({ createdAt: -1 });
    } else {
      bookings = await Booking.find({ userId: req.user._id }).sort({ createdAt: -1 });
    }
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update booking status
// @route   PATCH /api/bookings/:id
router.patch('/:id', protect, admin, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (booking) {
      booking.status = req.body.status || booking.status;
      const updatedBooking = await booking.save();
      res.json(updatedBooking);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;