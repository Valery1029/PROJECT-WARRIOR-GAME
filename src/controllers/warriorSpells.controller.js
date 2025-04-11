import { connect } from "../config/db/connect.js";

// GET all
export const showWarriorSpells = async (req, res) => {
  try {
    const [result] = await connect.query("SELECT * FROM warrior_spells");
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error fetching warrior spells", details: error.message });
  }
};

// GET by ID
export const showWarriorSpellsId = async (req, res) => {
  try {
    const [result] = await connect.query("SELECT * FROM warrior_spells WHERE id = ?", [req.params.id]);
    if (result.length === 0) return res.status(404).json({ error: "Warrior spell not found" });
    res.status(200).json(result[0]);
  } catch (error) {
    res.status(500).json({ error: "Error fetching warrior spell", details: error.message });
  }
};

// POST
export const addWarriorSpells = async (req, res) => {
  try {
    const { warrior_id, spell_id } = req.body;
    if (!warrior_id || !spell_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const sqlQuery = "INSERT INTO warrior_spells (warrior_id, spell_id) VALUES (?, ?)";
    const [result] = await connect.query(sqlQuery, [warrior_id, spell_id]);
    res.status(201).json({
      data: [{ id: result.insertId, warrior_id, spell_id }],
      status: 201
    });
  } catch (error) {
    res.status(500).json({ error: "Error adding warrior spell", details: error.message });
  }
};

// PUT
export const updateWarriorSpells = async (req, res) => {
  try {
    const { warrior_id, spell_id } = req.body;
    if (!warrior_id || !spell_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const sqlQuery = "UPDATE warrior_spells SET warrior_id = ?, spell_id = ? WHERE id = ?";
    const [result] = await connect.query(sqlQuery, [warrior_id, spell_id, req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Warrior spell not found" });
    res.status(200).json({
      data: [{ warrior_id, spell_id }],
      status: 200,
      updated: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating warrior spell", details: error.message });
  }
};

// DELETE
export const deleteWarriorSpells = async (req, res) => {
  try {
    const sqlQuery = "DELETE FROM warrior_spells WHERE id = ?";
    const [result] = await connect.query(sqlQuery, [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Warrior spell not found" });
    res.status(200).json({
      data: [],
      status: 200,
      deleted: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting warrior spell", details: error.message });
  }
};
