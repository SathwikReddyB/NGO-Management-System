import express from 'express';
import pool from '../db.js';

const router = express.Router();
const generateId = () => Date.now().toString();

// Create booking
router.post('/', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { candidateId, slotId, ngoId } = req.body;
    
    // Check if slot exists and has capacity
    const [slots] = await connection.query('SELECT capacity, booked FROM time_slots WHERE id = ?', [slotId]);
    if (slots.length === 0) throw new Error('Slot does not exist');
    
    const slot = slots[0];
    if (slot.booked >= slot.capacity) throw new Error('Slot is full');

    // Check if candidate already booked a slot for this NGO
    const [existingBookings] = await connection.query(
      'SELECT id FROM bookings WHERE candidateId = ? AND ngoId = ?', 
      [candidateId, ngoId]
    );
    if (existingBookings.length > 0) throw new Error('You can only book one slot for this NGO');

    const bookingId = generateId();

    // Insert booking
    await connection.query(
      'INSERT INTO bookings (id, candidateId, slotId, ngoId) VALUES (?, ?, ?, ?)',
      [bookingId, candidateId, slotId, ngoId]
    );

    // Update slot booked count
    await connection.query('UPDATE time_slots SET booked = booked + 1 WHERE id = ?', [slotId]);

    // Update NGO volunteer count
    await connection.query('UPDATE ngos SET volunteers = volunteers + 1 WHERE id = ?', [ngoId]);

    await connection.commit();
    res.status(201).json({ id: bookingId, message: 'Booking successful' });
  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(400).json({ error: err.message || 'Database error during booking' });
  } finally {
    connection.release();
  }
});

// Get bookings by candidate
router.get('/candidate/:candidateId', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT b.*, s.date as slotDate, s.startTime, s.endTime, s.description, n.name as ngoName 
      FROM bookings b
      JOIN time_slots s ON b.slotId = s.id
      JOIN ngos n ON b.ngoId = n.id
      WHERE b.candidateId = ?
    `, [req.params.candidateId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Get bookings by NGO
router.get('/ngo/:ngoId', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT b.*, c.name as candidateName, c.email, s.date as slotDate, s.startTime, s.endTime
      FROM bookings b
      JOIN candidates c ON b.candidateId = c.id
      JOIN time_slots s ON b.slotId = s.id
      WHERE b.ngoId = ?
    `, [req.params.ngoId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;
