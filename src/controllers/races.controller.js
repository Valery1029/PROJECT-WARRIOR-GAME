/* Author: Valery Escobar
Date: 07/04/2025 */

import { connect } from '../config/db/connect.js';

// GET
export const getRaces = async (req, res) => {
  try {
    const [result] = await connect.query('SELECT * FROM races');
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching races', details: error.message });
  }
};

// GET
export const getRaceId = async (req, res) => {
  try {
    const [result] = await connect.query('SELECT * FROM races WHERE race_id = ?', [req.params.id]);
    if (result.length === 0) return res.status(404).json({ error: 'Race not found' });
    res.status(200).json(result[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching race', details: error.message });
  }
};

// POST
export const addRace = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: 'Missing required field: name' });

    const sql = 'INSERT INTO races (race_name, race_description) VALUES (?, ?)';
    const [result] = await connect.query(sql, [name, description]);

    res.status(201).json({
      data: [{ id: result.insertId, name, description }],
      status: 201
    });
  } catch (error) {
    res.status(500).json({ error: 'Error adding race', details: error.message });
  }
};

// PUT
export const updateRace = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: 'Missing required field: name' });

    const sql = 'UPDATE races SET race_name = ?, race_description = ? WHERE race_id = ?';
    const [result] = await connect.query(sql, [name, description, req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: 'Race not found' });

    res.status(200).json({
      data: [{ name, description }],
      status: 200,
      updated: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: 'Error updating race', details: error.message });
  }
};

// DELETE
export const deleteRace = async (req, res) => {
  try {
    const sql = 'DELETE FROM races WHERE race_id = ?';
    const [result] = await connect.query(sql, [req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: 'Race not found' });

    res.status(200).json({
      data: [],
      status: 200,
      deleted: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting race', details: error.message });
  }
};
