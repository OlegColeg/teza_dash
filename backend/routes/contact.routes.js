import express from 'express';
import { query } from '../config/database.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Get all contacts
router.get('/', verifyToken, async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM contacts ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ message: 'Failed to fetch contacts', error: error.message });
  }
});

// Get contact by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM contacts WHERE id = $1',
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({ message: 'Failed to fetch contact', error: error.message });
  }
});

// Create contact
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, company, message } = req.body;

    if (!firstName || !lastName) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const result = await query(
      'INSERT INTO contacts (first_name, last_name, email, phone, company, message) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [firstName, lastName, email, phone, company, message]
    );

    res.status(201).json({
      message: 'Contact created successfully',
      contact: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({ message: 'Failed to create contact', error: error.message });
  }
});

// Delete contact
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const result = await query('DELETE FROM contacts WHERE id = $1 RETURNING id', [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ message: 'Failed to delete contact', error: error.message });
  }
});

export default router;
