// pages/api/debts/pay.js - Register a payment to reduce a team's debt
import { readJSON, writeJSON } from '../../../lib/db';
import { requireAuth } from '../../../lib/auth';
import { v4 as uuidv4 } from 'uuid';

export default function handler(req, res) {
  const user = requireAuth(req, res);
  if (!user) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodă nepermisă' });
  }

  const { teamId, amount, date, description } = req.body;

  if (!teamId || !amount || !date) {
    return res.status(400).json({ error: 'teamId, suma și data sunt obligatorii' });
  }

  const payAmount = Number(amount);
  if (payAmount <= 0) {
    return res.status(400).json({ error: 'Suma trebuie să fie pozitivă' });
  }

  const teams = readJSON('teams.json');
  const teamIdx = teams.findIndex(t => t.id === teamId);

  if (teamIdx === -1) {
    return res.status(404).json({ error: 'Echipa nu a fost găsită' });
  }

  const team = teams[teamIdx];
  const currentDebt = Math.abs(Math.min(team.balance, 0));

  if (payAmount > currentDebt) {
    return res.status(400).json({ error: `Suma depășește datoria curentă de ${currentDebt} lei` });
  }

  // Update team balance
  teams[teamIdx].balance = team.balance + payAmount;
  writeJSON('teams.json', teams);

  // Add income record
  const finances = readJSON('finances.json');
  const newFinance = {
    id: 'fin-' + uuidv4(),
    type: 'income',
    category: 'chirie_teren',
    description: description || `Achitare datorie - ${team.name}`,
    amount: payAmount,
    date,
    teamId,
    createdAt: new Date().toISOString()
  };
  finances.push(newFinance);
  writeJSON('finances.json', finances);

  return res.status(200).json({
    message: `Plată de ${payAmount} lei înregistrată pentru ${team.name}`,
    newBalance: teams[teamIdx].balance,
    financeEntry: newFinance
  });
}
