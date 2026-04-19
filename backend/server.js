import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js';

import authRoutes from './routes/auth.js';
import ngoRoutes from './routes/ngos.js';
import candidateRoutes from './routes/candidates.js';
import slotRoutes from './routes/slots.js';
import bookingRoutes from './routes/bookings.js';
import enrollmentRoutes from './routes/enrollments.js';
import statsRoutes from './routes/stats.js';

dotenv.config();

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/ngos', ngoRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/slots', slotRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/stats', statsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
