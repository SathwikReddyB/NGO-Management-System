import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, description, category, email, phone, address, website, image, volunteers, fundingGoal, currentFunding FROM ngos');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, description, category, email, phone, address, website, image, volunteers, fundingGoal, currentFunding FROM ngos WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'NGO not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;
