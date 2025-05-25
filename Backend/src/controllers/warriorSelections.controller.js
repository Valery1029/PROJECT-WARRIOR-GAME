import { connect } from "../config/db/connect.js";

// GET
export const showWarriorSelections = async (req, res) => {
  try {
    const [result] = await connect.query("SELECT * FROM warrior_selections");
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error fetching warrior selections", details: error.message });
  }
};

// GET 
export const showWarriorSelectionId = async (req, res) => {
  try {
    const [result] = await connect.query("SELECT * FROM warrior_selections WHERE id = ?", [req.params.id]);
    if (result.length === 0) return res.status(404).json({ error: "Warrior selection not found" });
    res.status(200).json(result[0]);
  } catch (error) {
    res.status(500).json({ error: "Error fetching warrior selection", details: error.message });
  }
};

// POST
export const addWarriorSelection = async (req, res) => {
  try {
    const { user_id, match_id, warrior_id } = req.body;
    if (!user_id || !match_id || !warrior_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const sqlQuery = "INSERT INTO warrior_selections (user_id, match_id, warrior_id) VALUES (?, ?, ?)";
    const [result] = await connect.query(sqlQuery, [user_id, match_id, warrior_id]);
    res.status(201).json({
      data: [{ id: result.insertId, user_id, match_id, warrior_id }],
      status: 201
    });
  } catch (error) {
    res.status(500).json({ error: "Error adding warrior selection", details: error.message });
  }
};

// PUT
export const updateWarriorSelection = async (req, res) => {
  try {
    const { user_id, match_id, warrior_id } = req.body;
    if (!user_id || !match_id || !warrior_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const sqlQuery = "UPDATE warrior_selections SET user_id=?, match_id=?, warrior_id=? WHERE id=?";
    const [result] = await connect.query(sqlQuery, [user_id, match_id, warrior_id, req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Warrior selection not found" });
    res.status(200).json({
      data: [{ id: req.params.id, user_id, match_id, warrior_id }],
      status: 200,
      updated: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating warrior selection", details: error.message });
  }
};

// DELETE
export const deleteWarriorSelection = async (req, res) => {
  try {
    const sqlQuery = "DELETE FROM warrior_selections WHERE id = ?";
    const [result] = await connect.query(sqlQuery, [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Warrior selection not found" });
    res.status(200).json({
      data: [],
      status: 200,
      deleted: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting warrior selection", details: error.message });
  }
};
