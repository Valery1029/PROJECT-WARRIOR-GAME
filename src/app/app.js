/* Author: Valery Escobar
Date: 07/04/2025 */

import express from 'express';
import powersRoutes from '../routes/powers.routes.js';
import spellsRoutes from '../routes/spells.routes.js';
import typeWarriorRoutes from '../routes/typeWarrior.routes.js';
import racesRoutes from '../routes/races.routes.js';
import usersRoutes from '../routes/users.routes.js';
import warriorsRoutes from '../routes/warriors.routes.js';
import warriorPowersRoutes from '../routes/warriorPowers.routes.js';
import warriorSpellsRoutes from '../routes/warriorSpells.routes.js';
import warriorSelectionsRoutes from '../routes/warriorSelections.routes.js';
import matchesRoutes from '../routes/matches.routes.js';
import apiUsersRoutes from '../routes/apiUsers.routes.js';

const app = express();
// Middleware
app.use(express.json());
// Routes
app.use('/gamev1', powersRoutes);
app.use('/gamev1', spellsRoutes);
app.use('/gamev1', typeWarriorRoutes);
app.use('/gamev1', typeWarriorRoutes);
app.use('/gamev1', racesRoutes);
app.use('/gamev1', usersRoutes);
app.use('/gamev1', warriorsRoutes);
app.use('/gamev1', warriorPowersRoutes);
app.use('/gamev1', warriorSpellsRoutes);
app.use('/gamev1', warriorSelectionsRoutes);
app.use('/gamev1', matchesRoutes);
app.use('/gamev1', apiUsersRoutes);

app.use((rep, res, nex) => {
  res.status(404).json({
    message: 'Endpoint losses'
  });
});

export default app;