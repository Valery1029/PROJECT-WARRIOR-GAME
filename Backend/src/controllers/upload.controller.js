

// GET
export const addUpload = async (req, res) => {
  try {
    const [result] = await connect.query("SELECT * FROM warriors");
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error fetching warriors", details: error.message });
  }
};


