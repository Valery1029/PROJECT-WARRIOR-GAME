/* Author: Valery Escobar
Date: 07/04/2025 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

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

// Obtener ruta base (__dirname con ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware para leer JSON
app.use(express.json());

// Servir archivos estáticos (JS, CSS, imágenes)
app.use(express.static(path.join(__dirname, 'public')));

// Servir vistas HTML (puedes agregar más si tienes otras)
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/game/user1', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'game', 'user1_view.html'));
});

// Rutas de la API
app.use('/gamev1', powersRoutes);
app.use('/gamev1', spellsRoutes);
app.use('/gamev1', typeWarriorRoutes);  // Solo una vez
app.use('/gamev1', racesRoutes);
app.use('/gamev1', usersRoutes);
app.use('/gamev1', warriorsRoutes);
app.use('/gamev1', warriorPowersRoutes);
app.use('/gamev1', warriorSpellsRoutes);
app.use('/gamev1', warriorSelectionsRoutes);
app.use('/gamev1', matchesRoutes);
app.use('/gamev1', apiUsersRoutes);

// Ruta no encontrada
app.use((req, res, next) => {
  res.status(404).json({
    message: 'Endpoint losses'
  });
});

export default app;