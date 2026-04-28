// pages/api/reservations/index.js
import { readJSON, writeJSON } from '../../../lib/db';
import { requireAuth } from '../../../lib/auth';
import { v4 as uuidv4 } from 'uuid';

export default function handler(req, res) {
  const user = requireAuth(req, res);
  if (!user) return;

  if (req.method === 'GET') {
    const reservations = readJSON('reservations.json');
    const { date } = req.query;
    if (date) {
      return res.status(200).json(reservations.filter(r => r.date === date));
    }
    return res.status(200).json(reservations);
  }

  if (req.method === 'POST') {
    const { teamId, date, startTime, endTime, paymentStatus } = req.body;

    if (!teamId || !date || !startTime || !endTime) {
      return res.status(400).json({ error: 'Toate câmpurile sunt obligatorii' });
    }

    // Validate team exists
    const teams = readJSON('teams.json');
    const team = teams.find(t => t.id === teamId);
    if (!team) {
      return res.status(404).json({ error: 'Echipa nu a fost găsită' });
    }

    // Check for conflicts
    const reservations = readJSON('reservations.json');
    const dateReservations = reservations.filter(r => r.date === date);

    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);

    if (endMinutes <= startMinutes) {
      return res.status(400).json({ error: 'Ora de sfârșit trebuie să fie după ora de început' });
    }

    const conflict = dateReservations.find(r => {
      const rStart = timeToMinutes(r.startTime);
      const rEnd = timeToMinutes(r.endTime);
      return startMinutes < rEnd && endMinutes > rStart;
    });

    if (conflict) {
      return res.status(400).json({ 
        error: `Terenul este deja rezervat de ${conflict.teamName} între ${conflict.startTime} - ${conflict.endTime}` 
      });
    }

    const hours = (endMinutes - startMinutes) / 60;
    const totalCost = hours * team.hourlyRate;
    const isPaid = paymentStatus === 'paid';
    const paidAmount = isPaid ? totalCost : 0;

    const newReservation = {
      id: 'res-' + uuidv4(),
      teamId,
      teamName: team.name,
      date,
      startTime,
      endTime,
      hours,
      totalCost,
      paymentStatus: isPaid ? 'paid' : 'deferred',
      paidAmount,
      createdAt: new Date().toISOString()
    };

    reservations.push(newReservation);
    writeJSON('reservations.json', reservations);

    // Update team balance if deferred
    if (!isPaid) {
      const teamIdx = teams.findIndex(t => t.id === teamId);
      teams[teamIdx].balance = (teams[teamIdx].balance || 0) - totalCost;
      writeJSON('teams.json', teams);
    }

    // Add income record if paid
    if (isPaid) {
      const finances = readJSON('finances.json');
      finances.push({
        id: 'fin-' + uuidv4(),
        type: 'income',
        category: 'chirie_teren',
        description: `Chirie teren - ${team.name} (${date} ${startTime}-${endTime})`,
        amount: totalCost,
        date,
        reservationId: newReservation.id,
        createdAt: new Date().toISOString()
      });
      writeJSON('finances.json', finances);
    }

    return res.status(201).json(newReservation);
  }

  return res.status(405).json({ error: 'Metodă nepermisă' });
}

function timeToMinutes(time) {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}
