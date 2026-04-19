import express from 'express';
import pool from '../db.js';

const router = express.Router();
const generateId = () => 'slot-' + Date.now().toString();

// Get slots by NGO
router.get('/ngo/:ngoId', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM time_slots WHERE ngoId = ?', [req.params.ngoId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Create slot
router.post('/', async (req, res) => {
  try {
    const { ngoId, date, startTime, endTime, capacity, description } = req.body;
    const id = generateId();

    await pool.query(
      'INSERT INTO time_slots (id, ngoId, date, startTime, endTime, capacity, description, booked) VALUES (?, ?, ?, ?, ?, ?, ?, 0)',
      [id, ngoId, date, startTime, endTime, capacity, description]
    );

    const [rows] = await pool.query('SELECT * FROM time_slots WHERE id = ?', [id]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Delete slot
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM time_slots WHERE id = ?', [req.params.id]);
    res.json({ message: 'Slot deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;
