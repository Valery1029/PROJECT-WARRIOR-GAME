import { connect } from "../config/db/connect.js";

//GET
export const showPowers = async (req, res) => {
  try {
    let sqlQuery= "SELECT * FROM powers";
    const [result] = await connect.query(sqlQuery);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error fetching powers", details: error.message });
  }
};

//GET BY PUT
export const showPowersId = async (req, res) => {
  try {
    const [result] = await connect.query('SELECT * FROM powers WHERE Power_id = ?', [req.params.id]);
    if (result.length === 0) return res.status(404).json({ error: "Powers not found"});
    res.status(200).json(result[0]);
  } catch (error) {
    res.status(500).json({ error: "Error fetching Powers", details: error.message });
  }
};

//POST
export const addPowers = async (req, res) => {
  try {
    const { name, description, percentage } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    let sqlQuery = "INSERT INTO powers (Power_name,Power_description, Power_percentage) VALUES (?,?,?)";
    const [result] = await connect.query(sqlQuery, [name, description, percentage]);
    res.status(201).json({
      data: [{ id: result.insertId, name, description, percentage}],
      status: 201
    });
  } catch (error) {
    res.status(500).json({ error: "Error adding powers", details: error.message });
  }
};

//PUT
export const updatePowers = async (req, res) => {
  try {
    const { name, description, percentage } = req.body;
    if ( !name ) {
      return res.status(400).json({ error: "Missing required fields "});
    }
    let sqlQuery = "UPDATE powers SET Power_name=?,Power_description=?,Power_percentage=? WHERE Power_id=?";
    const [result] = await connect.query(sqlQuery, [name, description, percentage, req.params.id ]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Powers not found"});
      res.status(200).json({
      data: [{  name, description, percentage }],
      status: 200,
      updated: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating powers", details: error.message });
  }
};

//DELETE
export const deletePowers = async (req, res) => {
  try {
    let sqlQuery = "DELETE FROM powers WHERE Power_id = ?";
    const [result] = await connect.query(sqlQuery, [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Powers not found" });
    res.status(200).json({
      data: [],
      status: 200,
      deleted: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting powers", details: error.message});
  }
};