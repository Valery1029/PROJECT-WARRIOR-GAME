import { connect } from "../config/db/connect.js";

// GET
export const showWarriorPowers = async (req, res) => {
  try {
    const [result] = await connect.query("SELECT * FROM warrior_powers");
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error fetching warrior powers", details: error.message });
  }
};

// GET
export const showWarriorPowersId = async (req, res) => {
  try {
    const [result] = await connect.query("SELECT * FROM warrior_powers WHERE id = ?", [req.params.id]);
    if (result.length === 0) return res.status(404).json({ error: "Warrior power not found" });
    res.status(200).json(result[0]);
  } catch (error) {
    res.status(500).json({ error: "Error fetching warrior power", details: error.message });
  }
};

// POST
export const addWarriorPowers = async (req, res) => {
  try {
    const { warrior_id, power_id } = req.body;
    if (!warrior_id || !power_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const [result] = await connect.query(
      "INSERT INTO warrior_powers (warrior_id, power_id) VALUES (?, ?)",
      [warrior_id, power_id]
    );
    res.status(201).json({
      data: [{ id: result.insertId, warrior_id, power_id }],
      status: 201
    });
  } catch (error) {
    res.status(500).json({ error: "Error adding warrior power", details: error.message });
  }
};

// PUT
export const updateWarriorPowers = async (req, res) => {
  try {
    const { warrior_id, power_id } = req.body;
    if (!warrior_id || !power_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const [result] = await connect.query(
      "UPDATE warrior_powers SET warrior_id = ?, power_id = ? WHERE id = ?",
      [warrior_id, power_id, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: "Warrior power not found" });
    res.status(200).json({
      data: [{ id: req.params.id, warrior_id, power_id }],
      status: 200,
      updated: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating warrior power", details: error.message });
  }
};

// DELETE
export const deleteWarriorPowers = async (req, res) => {
  try {
    const [result] = await connect.query("DELETE FROM warrior_powers WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Warrior power not found" });
    res.status(200).json({
      data: [],
      status: 200,
      deleted: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting warrior power", details: error.message });
  }
};
