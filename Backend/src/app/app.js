/* Author: Valery Escobar
Date: 07/04/2025 */

import express from 'express';
import cors from 'cors';
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
import roleRoutes from '../routes/role.routes.js';
import profileRoutes from '../routes/profile.routes.js';
import uploadRoutes from '../routes/upload.routes.js';
import winnersRoutes from '../routes/winners.routes.js';

const app = express();

// Obtener ruta base (__dirname con ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware para leer JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (Frontend completo)
app.use(express.static(path.join(__dirname, '../../../Frontend/public')));

// CORS
app.use(cors());

// Vistas directas desde rutas si deseas mantenerlas
// Usuario
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../../../Frontend/views/login/login_view.html'));
});

app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, '../../../Frontend/views/home/home_view.html'));
});

app.get('/partidas', (req, res) => {
  res.sendFile(path.join(__dirname, '../../../Frontend/views/home/partidas.html'));
});

app.get('/game', (req, res) => {
  res.sendFile(path.join(__dirname, '../../../Frontend/views/game/cards_view.html'));
});

app.get('/battle', (req, res) => {
  res.sendFile(path.join(__dirname, '../../../Frontend/views/game/battle_view.html'));
});

app.get('/profileUser', (req, res) => {
  res.sendFile(path.join(__dirname, '../../../Frontend/views/user/perfil.html'));
});

app.get('/ranking', (req, res) => {
  res.sendFile(path.join(__dirname, '../../../Frontend/views/user/rank_view.html'));
});

app.get('/history', (req, res) => {
  res.sendFile(path.join(__dirname, '../../../Frontend/views/user/historial_view.html'));
});

// Admin
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../../../Frontend/views/admin/admin.html'));
});

app.get('/powers', (req, res) => {
  res.sendFile(path.join(__dirname, '../../../Frontend/views/admin/poderes.html'));
});

app.get('/races', (req, res) => {
  res.sendFile(path.join(__dirname, '../../../Frontend/views/admin/razas.html'));
});

app.get('/spells', (req, res) => {
  res.sendFile(path.join(__dirname, '../../../Frontend/views/admin/hechizos.html'));
});

app.get('/typeWarrior', (req, res) => {
  res.sendFile(path.join(__dirname, '../../../Frontend/views/admin/tipoGuerrero.html'));
});

app.get('/users', (req, res) => {
  res.sendFile(path.join(__dirname, '../../../Frontend/views/admin/usuarios.html'));
});

app.get('/matches', (req, res) => {
  res.sendFile(path.join(__dirname, '../../../Frontend/views/admin/matches.html'));
});

app.get('/profileAdmin', (req, res) => {
  res.sendFile(path.join(__dirname, '../../../Frontend/views/admin/perfilAdmin.html'));
});

// Rutas API (prefijo /gamev1)
app.use('/gamev1', powersRoutes);
app.use('/gamev1', spellsRoutes);
app.use('/gamev1', typeWarriorRoutes);
app.use('/gamev1', racesRoutes);
app.use('/gamev1', usersRoutes);
app.use('/gamev1', warriorsRoutes);
app.use('/gamev1', warriorPowersRoutes);
app.use('/gamev1', warriorSpellsRoutes);
app.use('/gamev1', warriorSelectionsRoutes);
app.use('/gamev1', matchesRoutes);
app.use('/gamev1', apiUsersRoutes);
app.use('/gamev1', roleRoutes);
app.use('/gamev1', profileRoutes);
app.use('/gamev1', uploadRoutes);
app.use('/gamev1', winnersRoutes);


// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({
    message: 'Endpoint not found'
  });
});

export default app;