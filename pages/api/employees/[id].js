import { prisma } from '../../../lib/db.js';
import { requireAuth } from '../../../lib/auth.js';

export default async function handler(req, res) {
  if (!requireAuth(req, res)) return;
  const { id } = req.query;

  if (req.method === 'GET') {
    const employee = await prisma.employee.findUnique({ where: { id } });
    if (!employee) return res.status(404).json({ error: 'Angajat negăsit' });
    return res.json(employee);
  }

  if (req.method === 'PUT') {
    const { name, role, phone, email, salary, hiredAt, status, notes } = req.body;
    if (!name || !role || !hiredAt) return res.status(400).json({ error: 'Câmpurile Nume, Rol și Data angajării sunt obligatorii' });
    const employee = await prisma.employee.update({
      where: { id },
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
    return res.json(employee);
  }

  if (req.method === 'DELETE') {
    await prisma.employee.delete({ where: { id } });
    return res.json({ success: true });
  }

  res.status(405).end();
}
