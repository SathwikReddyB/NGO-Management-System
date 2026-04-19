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

router.put('/:id', async (req, res) => {
  try {
    const { name, description, category, email, phone, address, website, image, fundingGoal } = req.body;
    await pool.query(
      'UPDATE ngos SET name = ?, description = ?, category = ?, email = ?, phone = ?, address = ?, website = ?, image = ?, fundingGoal = ? WHERE id = ?',
      [name, description, category, email, phone, address, website, image, fundingGoal, req.params.id]
    );
    res.json({ message: 'NGO profile updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Database error during NGO update' });
  }
});

export default router;
