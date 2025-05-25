import { connect } from "../config/db/connect.js";

// GET
export const showWarriors = async (req, res) => {
  try {
    const [result] = await connect.query("SELECT * FROM warriors");
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error fetching warriors", details: error.message });
  }
};

// GET
export const showWarriorId = async (req, res) => {
  try {
    const [result] = await connect.query("SELECT * FROM warriors WHERE warrior_id = ?", [req.params.id]);
    if (result.length === 0) return res.status(404).json({ error: "Warrior not found" });
    res.status(200).json(result[0]);
  } catch (error) {
    res.status(500).json({ error: "Error fetching warrior", details: error.message });
  }
};

// POST
export const addWarrior = async (req, res) => {
  try {
    const {
      name,
      total_power,
      total_magic,
      health,
      speed,
      intelligence,
      status,
      type_warrior_id,
      race_id,
      image
    } = req.body;

    if (
      !name || total_power == null || total_magic == null || health == null ||
      speed == null || intelligence == null || !status || !type_warrior_id || !race_id || !image
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const sqlQuery = `
      INSERT INTO warriors (
        warrior_name, warrior_total_power, warrior_total_magic,
        warrior_health, warrior_speed, warrior_intelligence,
        warrior_status, type_warrior_id, race_id, warrior_image = ?
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const [result] = await connect.query(sqlQuery, [
      name, total_power, total_magic, health, speed, intelligence, status, type_warrior_id, race_id, image
    ]);

    res.status(201).json({
      data: [{ id: result.insertId, name }],
      status: 201
    });
  } catch (error) {
    res.status(500).json({ error: "Error adding warrior", details: error.message });
  }
};

// PUT
export const updateWarrior = async (req, res) => {
  try {
    const {
      name,
      total_power,
      total_magic,
      health,
      speed,
      intelligence,
      status,
      type_warrior_id,
      race_id,
      image
    } = req.body;

    if (
      !name || total_power == null || total_magic == null || health == null ||
      speed == null || intelligence == null || !status || !type_warrior_id || !race_id || !image
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const sqlQuery = `
      UPDATE warriors SET
        warrior_name = ?, warrior_total_power = ?, warrior_total_magic = ?,
        warrior_health = ?, warrior_speed = ?, warrior_intelligence = ?,
        warrior_status = ?, type_warrior_id = ?, race_id = ?, warrior_image = ?
      WHERE warrior_id = ?`;

    const [result] = await connect.query(sqlQuery, [
      name, total_power, total_magic, health, speed, intelligence, status,
      type_warrior_id, race_id, image, req.params.id
    ]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Warrior not found" });

    res.status(200).json({
      data: [{ id: req.params.id, name }],
      status: 200,
      updated: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating warrior", details: error.message });
  }
};

// DELETE
export const deleteWarrior = async (req, res) => {
  try {
    const sqlQuery = "DELETE FROM warriors WHERE warrior_id = ?";
    const [result] = await connect.query(sqlQuery, [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Warrior not found" });

    res.status(200).json({
      data: [],
      status: 200,
      deleted: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting warrior", details: error.message });
  }
};
