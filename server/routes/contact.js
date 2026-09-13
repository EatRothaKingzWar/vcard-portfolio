import express from 'express';
import pool from '../db.js';

const router = express.Router();

// POST /api/contact - Submit contact form
router.post('/', async (req, res) => {
  try {
    const { fullname, email, message } = req.body;

    if (!fullname || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required: fullname, email, message'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    const result = await pool.query(
      `INSERT INTO contacts (fullname, email, message)
       VALUES ($1, $2, $3)
       RETURNING id, fullname, email, message, created_at`,
      [fullname, email, message]
    );

    res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully!',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error. Please try again later.'
    });
  }
});

// GET /api/contact - Get all contacts
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM contacts ORDER BY created_at DESC'
    );
    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export default router;