import express from 'express';
import { query } from '../config/database.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Get all invoices
router.get('/', verifyToken, async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM invoices ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ message: 'Failed to fetch invoices', error: error.message });
  }
});

// Get invoice by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM invoices WHERE id = $1',
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching invoice:', error);
    res.status(500).json({ message: 'Failed to fetch invoice', error: error.message });
  }
});

// Create invoice
router.post('/', verifyToken, async (req, res) => {
  try {
    const { invoiceNumber, userId, amount, description, status, dueDate } = req.body;

    if (!invoiceNumber || !amount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const result = await query(
      'INSERT INTO invoices (invoice_number, user_id, amount, description, status, due_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [invoiceNumber, userId, amount, description, status || 'pending', dueDate]
    );

    res.status(201).json({
      message: 'Invoice created successfully',
      invoice: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({ message: 'Failed to create invoice', error: error.message });
  }
});

// Update invoice
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { invoiceNumber, amount, description, status, dueDate } = req.body;

    const result = await query(
      'UPDATE invoices SET invoice_number = $1, amount = $2, description = $3, status = $4, due_date = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *',
      [invoiceNumber, amount, description, status, dueDate, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.json({
      message: 'Invoice updated successfully',
      invoice: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating invoice:', error);
    res.status(500).json({ message: 'Failed to update invoice', error: error.message });
  }
});

// Delete invoice
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const result = await query('DELETE FROM invoices WHERE id = $1 RETURNING id', [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    res.status(500).json({ message: 'Failed to delete invoice', error: error.message });
  }
});

export default router;
