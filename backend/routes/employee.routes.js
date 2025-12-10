import express from 'express';
import { query } from '../config/database.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Get all employees
router.get('/', verifyToken, async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM employees ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Failed to fetch employees', error: error.message });
  }
});

// Get employee by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM employees WHERE id = $1',
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({ message: 'Failed to fetch employee', error: error.message });
  }
});

// Create employee
router.post('/', verifyToken, async (req, res) => {
  try {
    const { firstName, lastName, email, phone, department, position, salary, hireDate, status } = req.body;

    if (!firstName || !lastName || !email) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const result = await query(
      'INSERT INTO employees (first_name, last_name, email, phone, department, position, salary, hire_date, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [firstName, lastName, email, phone, department, position, salary, hireDate, status || 'active']
    );

    res.status(201).json({
      message: 'Employee created successfully',
      employee: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ message: 'Failed to create employee', error: error.message });
  }
});

// Update employee
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { firstName, lastName, email, phone, department, position, salary, hireDate, status } = req.body;
    const employeeId = req.params.id;

    const result = await query(
      'UPDATE employees SET first_name = $1, last_name = $2, email = $3, phone = $4, department = $5, position = $6, salary = $7, hire_date = $8, status = $9, updated_at = CURRENT_TIMESTAMP WHERE id = $10 RETURNING *',
      [firstName, lastName, email, phone, department, position, salary, hireDate, status, employeeId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json({
      message: 'Employee updated successfully',
      employee: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ message: 'Failed to update employee', error: error.message });
  }
});

// Delete employee
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const result = await query('DELETE FROM employees WHERE id = $1 RETURNING id', [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ message: 'Failed to delete employee', error: error.message });
  }
});

export default router;
