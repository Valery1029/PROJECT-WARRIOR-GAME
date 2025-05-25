import { connect } from "../config/db/connect.js";

//GET
export const getTypeWarriors = async (req, res) => {
  try {
    const [result] = await connect.query("SELECT * FROM type_warrior");
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error fetching types", details: error.message });
  }
};

//GET BY PUT
export const getTypeWarriorId = async (req, res) => {
  try {
    const [result] = await connect.query("SELECT * FROM type_warrior WHERE type_warrior_id = ?", [req.params.id]);
    if (result.length === 0) return res.status(404).json({ error: "Type not found" });
    res.status(200).json(result[0]);
  } catch (error) {
    res.status(500).json({ error: "Error fetching type", details: error.message });
  }
};

//POST
export const addTypeWarrior = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: "Missing name" });

    const sql = "INSERT INTO type_warrior (type_warrior_name, type_warrior_description) VALUES (?, ?)";
    const [result] = await connect.query(sql, [name, description]);
    res.status(201).json({ id: result.insertId, name, description });
  } catch (error) {
    res.status(500).json({ error: "Error adding type", details: error.message });
  }
};

//PUT
export const updateTypeWarrior = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: "Missing name" });

    const sql = "UPDATE type_warrior SET type_warrior_name=?, type_warrior_description=? WHERE type_warrior_id=?";
    const [result] = await connect.query(sql, [name, description, req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Type not found" });

    res.status(200).json({ updated: result.affectedRows, name, description });
  } catch (error) {
    res.status(500).json({ error: "Error updating type", details: error.message });
  }
};

//DELETE
export const deleteTypeWarrior = async (req, res) => {
  try {
    const [result] = await connect.query("DELETE FROM type_warrior WHERE type_warrior_id = ?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Type not found" });

    res.status(200).json({ deleted: result.affectedRows });
  } catch (error) {
    res.status(500).json({ error: "Error deleting type", details: error.message });
  }
};
