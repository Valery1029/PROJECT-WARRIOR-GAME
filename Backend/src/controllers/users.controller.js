import { connect } from "../config/db/connect.js";
import { encryptPassword, comparePassword } from '../library/appBcrypt.js';
import jwt from 'jsonwebtoken';

// GET 
export const showUsers = async (req, res) => {
  try {
    const [result] = await connect.query("SELECT * FROM users");
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users", details: error.message });
  }
};

// GET 
export const showUserId = async (req, res) => {
  try {
    const [result] = await connect.query("SELECT * FROM users WHERE user_id = ?", [req.params.id]);
    if (result.length === 0) return res.status(404).json({ error: "User not found" });
    res.status(200).json(result[0]);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user", details: error.message });
  }
};

// POST 
export const addUser = async (req, res) => {
  try {
    const { name, email, password, role_id = 1, image = 'default.jpg' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Verificar si el email ya está registrado
    const [existingUser] = await connect.query("SELECT * FROM users WHERE user_email = ?", [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Encriptar contraseña
    const hashedPassword = await encryptPassword(password);

    // Insertar usuario
    const sqlQuery = `
      INSERT INTO users (user_name, user_email, user_password, role_id, user_image)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [userResult] = await connect.query(sqlQuery, [name, email, hashedPassword, role_id, image]);

    const userId = userResult.insertId;

    const sqlProfile = "INSERT INTO profiles (user_id, victories, defeats, score) VALUES (?, 0, 0, 0)";
    await connect.query(sqlProfile, [userId]);

    res.status(201).json({
      data: [{
        id: userId,
        name,
        email,
        role_id,
        image
      }],
      status: 201
    });

  } catch (error) {
    res.status(500).json({ error: "Error adding user", details: error.message });
  }
};

// PUT
export const updateUser = async (req, res) => {
  try {
    const { name, email, password, role, image } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Missing required fields (name or email)" });
    }

    let sqlQuery = "UPDATE users SET user_name = ?, user_email = ?";
    const values = [name, email];

    if (role) {
      sqlQuery += ", role_id = ?";
      values.push(role);
    }

    if (password) {
      const hashedPassword = await encryptPassword(password);
      sqlQuery += ", user_password = ?";
      values.push(hashedPassword);
    }

    if (image) {
      sqlQuery += ", user_image = ?";
      values.push(image);
    }

    sqlQuery += " WHERE user_id = ?";
    values.push(req.params.id);

    const [result] = await connect.query(sqlQuery, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      data: [{
        id: req.params.id,
        name,
        email,
        ...(role && { role }),
        ...(password && { password: "[updated]" }),
        ...(image && { image })
      }],
      status: 200,
      updated: result.affectedRows
    });

  } catch (error) {
    res.status(500).json({ error: "Error updating user", details: error.message });
  }
};

// DELETE
export const deleteUser = async (req, res) => {
  try {
    const sqlQuery = "DELETE FROM users WHERE user_id = ?";
    const [result] = await connect.query(sqlQuery, [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "User not found" });
    res.status(200).json({
      data: [],
      status: 200,
      deleted: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting user", details: error.message });
  }
};

//Login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const sqlQuery = `
      SELECT user_id, user_name, user_email, user_password, role_id 
      FROM users 
      WHERE user_email = ?
    `;
    const [result] = await connect.query(sqlQuery, [email]);
    if (result.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    const user = result[0];
    const validPassword = await comparePassword(password, user.user_password);
    if (!validPassword) {
      return res.status(401).json({ error: "Incorrect password" });
    }
    const token = jwt.sign(
      { id: user.user_id, name: user.user_name, email: user.user_email, role: user.role_id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({
      token,
      user: {
        id: user.user_id,
        name: user.user_name,
        email: user.user_email,
        role: user.role_id
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Error during login", details: error.message });
  }
};