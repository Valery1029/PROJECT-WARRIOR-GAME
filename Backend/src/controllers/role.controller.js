import { connect } from "../config/db/connect.js";

// GET
export const showRoles = async (req, res) => {
  try {
    const [result] = await connect.query("SELECT * FROM roles");
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error fetching roles", details: error.message });
  }
};

// GET by ID
export const showRoleId = async (req, res) => {
  try {
    const [result] = await connect.query("SELECT * FROM roles WHERE role_id = ?", [req.params.id]);
    if (result.length === 0) return res.status(404).json({ error: "Role not found" });
    res.status(200).json(result[0]);
  } catch (error) {
    res.status(500).json({ error: "Error fetching role", details: error.message });
  }
};

// POST
export const addRole = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Missing role name" });

    const [result] = await connect.query("INSERT INTO roles (role_name) VALUES (?)", [name]);
    res.status(201).json({ data: [{ id: result.insertId, name }], status: 201 });
  } catch (error) {
    res.status(500).json({ error: "Error adding role", details: error.message });
  }
};

// PUT
export const updateRole = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Missing role name" });

    const [result] = await connect.query("UPDATE roles SET role_name = ? WHERE role_id = ?", [name, req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Role not found" });

    res.status(200).json({ data: [{ id: req.params.id, name }], updated: result.affectedRows });
  } catch (error) {
    res.status(500).json({ error: "Error updating role", details: error.message });
  }
};

// DELETE
export const deleteRole = async (req, res) => {
  try {
    const [result] = await connect.query("DELETE FROM roles WHERE role_id = ?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Role not found" });

    res.status(200).json({ deleted: result.affectedRows });
  } catch (error) {
    res.status(500).json({ error: "Error deleting role", details: error.message });
  }
};
