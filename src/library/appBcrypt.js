/* Author: Valery Escobar
Date: 07/04/2025 */
import appBcrypt from "bcrypt";
const saltRounds = 10;

// Encriptar contraseña
export const encryptPassword = async (password) => {
  try {
    const hashedPassword = await appBcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.error('Error encrypt: ', error);
    throw error;
  }
};

// Comparar contraseña
export const comparePassword = async (password, hashedPassword) => {
  try {
    const match = await appBcrypt.hash(password, hashedPassword);
    return match;
  } catch (error) {
    console.error('Error compare the hash: ', error);
    throw error;
  }
};