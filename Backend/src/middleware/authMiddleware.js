import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Middleware to verify the token
export const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const bearerToken = token.split(' ')[1];
    const verified = jwt.verify(bearerToken, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    console.error("Error en verifyToken:", err.message);
    res.status(400).json({ error: 'Invalid Token' });
  }
};

// Role
export const isAdmin = (req, res, next) => {
  if (req.user.role !== 2) {
    return res.status(403).json({ message: 'Acceso denegado: solo administradores' });
  }
  next();
};