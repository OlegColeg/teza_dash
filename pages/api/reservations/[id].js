// pages/api/reservations/[id].js
import { readJSON, writeJSON } from '../../../lib/db';
import { requireAuth } from '../../../lib/auth';

export default function handler(req, res) {
  const user = requireAuth(req, res);
  if (!user) return;

  const { id } = req.query;
  const reservations = readJSON('reservations.json');
  const idx = reservations.findIndex(r => r.id === id);

  if (idx === -1) {
    return res.status(404).json({ error: 'Rezervarea nu a fost găsită' });
  }

  if (req.method === 'GET') {
    return res.status(200).json(reservations[idx]);
  }

  if (req.method === 'DELETE') {
    const reservation = reservations[idx];

    // Restore team balance if deferred (undo the debt)
    if (reservation.paymentStatus === 'deferred') {
      const teams = readJSON('teams.json');
      const teamIdx = teams.findIndex(t => t.id === reservation.teamId);
      if (teamIdx !== -1) {
        teams[teamIdx].balance = (teams[teamIdx].balance || 0) + reservation.totalCost;
        writeJSON('teams.json', teams);
      }
    }

    reservations.splice(idx, 1);
    writeJSON('reservations.json', reservations);
    return res.status(200).json({ message: 'Rezervarea a fost ștearsă' });
  }

  return res.status(405).json({ error: 'Metodă nepermisă' });
}
