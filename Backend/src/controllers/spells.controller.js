/* Author: Valery Escobar
Date: 07/04/2025 */

import { connect } from '../config/db/connect.js';

// GET ALL
export const getSpells = async (req, res) => {
  try {
    const [result] = await connect.query('SELECT * FROM spells');
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching spells', details: error.message });
  }
};

// GET ONE
export const getSpellId = async (req, res) => {
  try {
    const [result] = await connect.query('SELECT * FROM spells WHERE spell_id = ?', [req.params.id]);
    if (result.length === 0) return res.status(404).json({ error: 'Spell not found' });
    res.status(200).json(result[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching spell', details: error.message });
  }
};

// POST
export const addSpell = async (req, res) => {
  try {
    const { name, description, percentage } = req.body;
    if (!name) return res.status(400).json({ error: 'Missing required field: name' });

    const sql = 'INSERT INTO spells (spell_name, spell_description, spell_percentage) VALUES (?, ?, ?)';
    const [result] = await connect.query(sql, [name, description, percentage]);

    res.status(201).json({
      data: [{ id: result.insertId, name, description, percentage }],
      status: 201
    });
  } catch (error) {
    res.status(500).json({ error: 'Error adding spell', details: error.message });
  }
};

// PUT
export const updateSpell = async (req, res) => {
  try {
    const { name, description, percentage } = req.body;
    if (!name) return res.status(400).json({ error: 'Missing required field: name' });

    const sql = 'UPDATE spells SET spell_name = ?, spell_description = ?, spell_percentage = ? WHERE spell_id = ?';
    const [result] = await connect.query(sql, [name, description, percentage, req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: 'Spell not found' });

    res.status(200).json({
      data: [{ name, description, percentage }],
      status: 200,
      updated: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: 'Error updating spell', details: error.message });
  }
};

// DELETE
export const deleteSpell = async (req, res) => {
  try {
    const sql = 'DELETE FROM spells WHERE spell_id = ?';
    const [result] = await connect.query(sql, [req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: 'Spell not found' });

    res.status(200).json({
      data: [],
      status: 200,
      deleted: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting spell', details: error.message });
  }
};