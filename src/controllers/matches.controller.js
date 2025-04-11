import { connect } from "../config/db/connect.js";

// GET
export const showMatches = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM matches";
    const [result] = await connect.query(sqlQuery);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error fetching matches", details: error.message });
  }
};

// GET ID
export const showMatchId = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM matches WHERE match_id = ?";
    const [result] = await connect.query(sqlQuery, [req.params.id]);
    if (result.length === 0) return res.status(404).json({ error: "Match not found" });
    res.status(200).json(result[0]);
  } catch (error) {
    res.status(500).json({ error: "Error fetching match", details: error.message });
  }
};

// POST
export const addMatch = async (req, res) => {
  try {
    const { user1_id, user2_id, winner_id } = req.body;
    if (!user1_id || !user2_id || !winner_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const sqlQuery = "INSERT INTO matches (user1_id, user2_id, winner_id) VALUES (?, ?, ?)";
    const [result] = await connect.query(sqlQuery, [user1_id, user2_id, winner_id]);
    res.status(201).json({
      data: [{ match_id: result.insertId, user1_id, user2_id, winner_id }],
      status: 201
    });
  } catch (error) {
    res.status(500).json({ error: "Error adding match", details: error.message });
  }
};

// PUT
export const updateMatch = async (req, res) => {
  try {
    const { user1_id, user2_id, winner_id } = req.body;
    if (!user1_id || !user2_id || !winner_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const sqlQuery = "UPDATE matches SET user1_id = ?, user2_id = ?, winner_id = ? WHERE match_id = ?";
    const [result] = await connect.query(sqlQuery, [user1_id, user2_id, winner_id, req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Match not found" });

    res.status(200).json({
      data: [{ user1_id, user2_id, winner_id }],
      status: 200,
      updated: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating match", details: error.message });
  }
};

// DELETE
export const deleteMatch = async (req, res) => {
  try {
    const sqlQuery = "DELETE FROM matches WHERE match_id = ?";
    const [result] = await connect.query(sqlQuery, [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Match not found" });

    res.status(200).json({
      data: [],
      status: 200,
      deleted: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting match", details: error.message });
  }
};
