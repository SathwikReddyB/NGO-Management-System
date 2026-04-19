import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db.js';

const router = express.Router();

const generateId = () => Date.now().toString();

// Register NGO
router.post('/register/ngo', async (req, res) => {
  try {
    const { name, description, category, email, phone, address, website, fundingGoal, password } = req.body;
    
    const [existing] = await pool.query('SELECT * FROM ngos WHERE email = ?', [email]);
    if (existing.length > 0) return res.status(400).json({ error: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const id = generateId();

    await pool.query(
      'INSERT INTO ngos (id, name, description, category, email, phone, address, website, fundingGoal, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, name, description, category, email, phone, address, website || null, fundingGoal || 0, hashedPassword]
    );

    const token = jwt.sign({ id, role: 'ngo' }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ id, token, role: 'ngo' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during NGO registration' });
  }
});

// Register Candidate
router.post('/register/candidate', async (req, res) => {
  try {
    const { name, email, phone, skills, availability, password } = req.body;

    const [existing] = await pool.query('SELECT * FROM candidates WHERE email = ?', [email]);
    if (existing.length > 0) return res.status(400).json({ error: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const id = generateId();

    await pool.query(
      'INSERT INTO candidates (id, name, email, phone, skills, availability, password) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, name, email, phone, JSON.stringify(skills), availability || '', hashedPassword]
    );

    const token = jwt.sign({ id, role: 'candidate' }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ id, token, role: 'candidate' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during Candidate registration' });
  }
});

// Login NGO
router.post('/login/ngo', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const [ngos] = await pool.query('SELECT * FROM ngos WHERE email = ?', [email]);
    if (ngos.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const ngo = ngos[0];
    const match = await bcrypt.compare(password, ngo.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: ngo.id, role: 'ngo' }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ id: ngo.id, token, role: 'ngo' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Login Candidate
router.post('/login/candidate', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const [candidates] = await pool.query('SELECT * FROM candidates WHERE email = ?', [email]);
    if (candidates.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const candidate = candidates[0];
    const match = await bcrypt.compare(password, candidate.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: candidate.id, role: 'candidate' }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ id: candidate.id, token, role: 'candidate' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

export default router;
