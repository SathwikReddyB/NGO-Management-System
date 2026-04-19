import express from 'express';
import pool from '../db.js';

const router = express.Router();
const generateId = () => Date.now().toString();

// Create enrollment (donation)
router.post('/', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { candidateId, ngoId, serviceType, amount } = req.body;
    const id = generateId();

    await connection.query(
      'INSERT INTO enrollments (id, candidateId, ngoId, serviceType, amount) VALUES (?, ?, ?, ?, ?)',
      [id, candidateId || null, ngoId, serviceType, amount]
    );

    // Update NGO funding if payment
    if (serviceType === 'payment' && amount) {
      await connection.query('UPDATE ngos SET currentFunding = currentFunding + ? WHERE id = ?', [amount, ngoId]);
    }

    await connection.commit();
    res.status(201).json({ id, message: 'Enrollment successful' });
  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(500).json({ error: 'Database error during enrollment' });
  } finally {
    connection.release();
  }
});

// Get enrollments by candidate
router.get('/candidate/:candidateId', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT e.*, n.name as ngoName 
      FROM enrollments e
      JOIN ngos n ON e.ngoId = n.id
      WHERE e.candidateId = ?
    `, [req.params.candidateId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get enrollments by NGO
router.get('/ngo/:ngoId', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT e.*, c.name as candidateName 
      FROM enrollments e
      LEFT JOIN candidates c ON e.candidateId = c.id
      WHERE e.ngoId = ?
    `, [req.params.ngoId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;
