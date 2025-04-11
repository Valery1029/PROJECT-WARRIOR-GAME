import { connect } from "../config/db/connect.js";

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
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const sqlQuery = "INSERT INTO users (user_name, user_email, user_password) VALUES (?, ?, ?)";
    const [result] = await connect.query(sqlQuery, [name, email, password]);
    res.status(201).json({
      data: [{ id: result.insertId, name, email }],
      status: 201
    });
  } catch (error) {
    res.status(500).json({ error: "Error adding user", details: error.message });
  }
};

// PUT
export const updateUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const sqlQuery = "UPDATE users SET user_name=?, user_email=?, user_password=? WHERE user_id=?";
    const [result] = await connect.query(sqlQuery, [name, email, password, req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "User not found" });
    res.status(200).json({
      data: [{ id: req.params.id, name, email }],
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
