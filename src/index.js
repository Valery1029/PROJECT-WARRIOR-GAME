/* Author: Valery Escobar
Date: 07/04/2025 */
import app from './app/app.js';
import dotenv from 'dotenv';

dotenv.config({path: '../env'})
const PORT = process.env.SERVER_PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running... on port ${PORT}`);
});