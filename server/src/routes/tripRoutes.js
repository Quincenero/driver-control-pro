import express from 'express';
import { getTrips, createTrip, getTripStats } from '../controllers/tripController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getTrips)
  .post(protect, createTrip);

router.get('/stats', protect, getTripStats);

export default router;