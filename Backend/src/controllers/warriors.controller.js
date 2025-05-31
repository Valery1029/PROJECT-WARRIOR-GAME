import { connect } from "../config/db/connect.js";

// GET all warriors
export const showWarriors = async (req, res) => {
  try {
    const [result] = await connect.query("SELECT * FROM warriors");
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error fetching warriors", details: error.message });
  }
};

// GET warrior by ID
export const showWarriorId = async (req, res) => {
  try {
    const [result] = await connect.query("SELECT * FROM warriors WHERE warrior_id = ?", [req.params.id]);
    if (result.length === 0) return res.status(404).json({ error: "Warrior not found" });
    res.status(200).json(result[0]);
  } catch (error) {
    res.status(500).json({ error: "Error fetching warrior", details: error.message });
  }
};

// POST add new warrior
export const addWarrior = async (req, res) => {
  try {
    const {
      name,
      total_power,
      total_magic,
      health,
      speed,
      intelligence,
      type_warrior_id,
      race_id,
      image = 'Back.jpg'
    } = req.body;

    if (
      !name ||
      total_power === undefined || total_magic === undefined || health === undefined ||
      speed === undefined || intelligence === undefined ||
      !type_warrior_id || !race_id
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const sqlQuery = `
      INSERT INTO warriors (
        warrior_name, warrior_total_power, warrior_total_magic,
        warrior_health, warrior_speed, warrior_intelligence,
        type_warrior_id, race_id, warrior_image
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await connect.query(sqlQuery, [
      name, total_power, total_magic, health, speed, intelligence,
      type_warrior_id, race_id, image
    ]);

    res.status(201).json({
      data: [{
        id: result.insertId,
        name,
        image,
        total_power,
        total_magic,
        health,
        speed,
        intelligence,
        type_warrior_id,
        race_id
      }],
      status: 201
    });

  } catch (error) {
    res.status(500).json({ error: "Error adding warrior", details: error.message });
  }
};

// PUT update warrior by ID
export const updateWarrior = async (req, res) => {
  try {
    const {
      name,
      total_power,
      total_magic,
      health,
      speed,
      intelligence,
      type_warrior_id,
      race_id,
      image
    } = req.body;

    if (
      !name ||
      total_power === undefined || total_magic === undefined || health === undefined ||
      speed === undefined || intelligence === undefined ||
      !type_warrior_id || !race_id
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Arreglo para valores a pasar
    const values = [
      name, total_power, total_magic, health, speed, intelligence,
      type_warrior_id, race_id
    ];

    // Empezamos el query
    let sqlQuery = `
      UPDATE warriors SET
        warrior_name = ?, warrior_total_power = ?, warrior_total_magic = ?,
        warrior_health = ?, warrior_speed = ?, warrior_intelligence = ?,
        type_warrior_id = ?, race_id = ?
    `;

    // Si hay imagen, agregamos al SET y al arreglo de valores
    if (image) {
      sqlQuery += `, warrior_image = ?`;
      values.push(image);
    }

    // Agregamos la condición WHERE (el id al final del arreglo)
    sqlQuery += ` WHERE warrior_id = ?`;
    values.push(req.params.id);

    // Ejecutamos la consulta con los valores completos
    const [result] = await connect.query(sqlQuery, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Warrior not found" });
    }

    res.status(200).json({
      data: [{
        id: req.params.id,
        name,
        total_power,
        total_magic,
        health,
        speed,
        intelligence,
        type_warrior_id,
        race_id,
        ...(image && { image })
      }],
      status: 200,
      updated: result.affectedRows
    });

  } catch (error) {
    res.status(500).json({ error: "Error updating warrior", details: error.message });
  }
};


// DELETE warrior by ID
export const deleteWarrior = async (req, res) => {
  try {
    const sqlQuery = "DELETE FROM warriors WHERE warrior_id = ?";
    const [result] = await connect.query(sqlQuery, [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Warrior not found" });
    }

    res.status(200).json({
      data: [],
      status: 200,
      deleted: result.affectedRows
    });

  } catch (error) {
    res.status(500).json({ error: "Error deleting warrior", details: error.message });
  }
};
