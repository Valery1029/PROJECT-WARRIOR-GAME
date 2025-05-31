import { connect } from "../config/db/connect.js";

// GET - Mostrar todos los ganadores
export const showWinners = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM winners";
    const [result] = await connect.query(sqlQuery);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error fetching winners", details: error.message });
  }
};

// GET BY ID - Mostrar ganador por ID
export const showWinnerById = async (req, res) => {
  try {
    const [result] = await connect.query("SELECT * FROM winners WHERE id = ?", [req.params.id]);
    if (result.length === 0) return res.status(404).json({ error: "Winner not found" });
    res.status(200).json(result[0]);
  } catch (error) {
    res.status(500).json({ error: "Error fetching winner", details: error.message });
  }
};

// POST - Agregar nuevo ganador o actualizar si ya existe
export const addWinner = async (req, res) => {
  try {
    const { winner_name } = req.body;
    if (!winner_name) {
      return res.status(400).json({ error: "Missing required field: winner_name" });
    }

    // Buscar si el ganador ya existe
    const [existing] = await connect.query("SELECT * FROM winners WHERE winner_name = ?", [winner_name]);

    if (existing.length > 0) {
      // Si existe, actualizar sumando una partida ganada
      const currentWins = existing[0].partidas_ganadas || 0;
      const newWins = currentWins + 1;

      await connect.query("UPDATE winners SET partidas_ganadas = ? WHERE winner_name = ?", [newWins, winner_name]);

      return res.status(200).json({
        data: [{ id: existing[0].id, winner_name, partidas_ganadas: newWins }],
        status: 200,
        message: "Winner updated with additional win"
      });
    } else {
      // Si no existe, insertar nuevo ganador
      const [result] = await connect.query(
        "INSERT INTO winners (winner_name, partidas_ganadas) VALUES (?, ?)",
        [winner_name, 1]
      );

      return res.status(201).json({
        data: [{ id: result.insertId, winner_name, partidas_ganadas: 1 }],
        status: 201,
        message: "Winner created"
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Error adding/updating winner", details: error.message });
  }
};


// PUT - Actualizar un ganador por ID
export const updateWinner = async (req, res) => {
  try {
    const { winner_name, partidas_ganadas } = req.body;
    if (!winner_name || partidas_ganadas === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const sqlQuery = "UPDATE winners SET winner_name = ?, partidas_ganadas = ? WHERE id = ?";
    const [result] = await connect.query(sqlQuery, [winner_name, partidas_ganadas, req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Winner not found" });

    res.status(200).json({
      data: [{ id: req.params.id, winner_name, partidas_ganadas }],
      status: 200,
      updated: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating winner", details: error.message });
  }
};

// DELETE - Eliminar un ganador por ID
export const deleteWinner = async (req, res) => {
  try {
    const sqlQuery = "DELETE FROM winners WHERE id = ?";
    const [result] = await connect.query(sqlQuery, [req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Winner not found" });

    res.status(200).json({
      data: [],
      status: 200,
      deleted: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting winner", details: error.message });
  }
};