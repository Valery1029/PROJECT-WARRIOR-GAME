import { connect } from "../config/db/connect.js";

// GET
export const showProfiles = async (req, res) => {
  try {
    const [result] = await connect.query("SELECT * FROM profiles");
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error fetching profiles", details: error.message });
  }
};

// GET by ID
export const showProfileId = async (req, res) => {
  try {
    const [result] = await connect.query("SELECT * FROM profiles WHERE profile_id = ?", [req.params.id]);
    if (result.length === 0) return res.status(404).json({ error: "Profile not found" });
    res.status(200).json(result[0]);
  } catch (error) {
    res.status(500).json({ error: "Error fetching profile", details: error.message });
  }
};

// POST
export const addProfile = async (req, res) => {
  try {
    const { user_id, victories = 0, defeats = 0, score = 0 } = req.body;
    if (!user_id) return res.status(400).json({ error: "Missing user_id" });

    const sqlQuery = "INSERT INTO profiles (user_id, victories, defeats, score) VALUES (?, ?, ?, ?)";
    const [result] = await connect.query(sqlQuery, [user_id, victories, defeats, score]);

    res.status(201).json({ data: [{ id: result.insertId, user_id }], status: 201 });
  } catch (error) {
    res.status(500).json({ error: "Error creating profile", details: error.message });
  }
};

// PUT
export const updateProfile = async (req, res) => {
  try {
    const { victories, defeats, score } = req.body;
    const [result] = await connect.query(`
      UPDATE profiles SET victories = ?, defeats = ?, score = ? WHERE profile_id = ?
    `, [victories, defeats, score, req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Profile not found" });

    res.status(200).json({ updated: result.affectedRows });
  } catch (error) {
    res.status(500).json({ error: "Error updating profile", details: error.message });
  }
};

// DELETE
export const deleteProfile = async (req, res) => {
  try {
    const [result] = await connect.query("DELETE FROM profiles WHERE profile_id = ?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Profile not found" });

    res.status(200).json({ deleted: result.affectedRows });
  } catch (error) {
    res.status(500).json({ error: "Error deleting profile", details: error.message });
  }
};
