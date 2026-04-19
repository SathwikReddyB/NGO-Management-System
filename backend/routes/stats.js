import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [ngosResult] = await pool.query('SELECT COUNT(*) as count FROM ngos');
    const [candidatesResult] = await pool.query('SELECT COUNT(*) as count FROM candidates');
    const [donationsResult] = await pool.query('SELECT SUM(amount) as total FROM enrollments WHERE serviceType = "payment"');

    res.json({
      activeVolunteers: candidatesResult[0].count,
      registeredNgos: ngosResult[0].count,
      fundsRaised: donationsResult[0].total || 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch global stats' });
  }
});

export default router;
