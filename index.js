/* Author: Valery Escobar
Date: 07/04/2025 */

import app from './Backend/src/app/app.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: './.env' });

const PORT = process.env.SERVER_PORT || 3000;

// Obtener __dirname con ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on: http://localhost:${PORT}/login`);
});