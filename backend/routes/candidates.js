import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, email, phone, skills, availability FROM candidates WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Candidate not found' });
    
    // Parse skills back to array if needed
    const candidate = rows[0];
    try {
      if (typeof candidate.skills === 'string') {
        candidate.skills = JSON.parse(candidate.skills);
      }
    } catch(e) {}

    res.json(candidate);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;
