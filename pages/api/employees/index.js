import { prisma } from '../../../lib/db.js';
import { requireAuth } from '../../../lib/auth.js';

export default async function handler(req, res) {
  if (!requireAuth(req, res)) return;

  if (req.method === 'GET') {
    const employees = await prisma.employee.findMany({ orderBy: { name: 'asc' } });
    const active = employees.filter(e => e.status === 'active').length;
    const totalSalary = employees.filter(e => e.status === 'active').reduce((s, e) => s + e.salary, 0);
    return res.json({ employees, summary: { total: employees.length, active, totalSalary } });
  }

  if (req.method === 'POST') {
    const { name, role, phone, email, salary, hiredAt, status, notes } = req.body;
    if (!name || !role || !hiredAt) return res.status(400).json({ error: 'Câmpurile Nume, Rol și Data angajării sunt obligatorii' });
    const employee = await prisma.employee.create({
      data: {
        name,
        role,
        phone: phone || null,
        email: email || null,
        salary: Number(salary) || 0,
        hiredAt,
        status: status || 'active',
        notes: notes || null,
      }
    });
    return res.status(201).json(employee);
  }

  res.status(405).end();
}
