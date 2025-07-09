const db = require("../config/db"); 

const addDeathRecord = (req, res) => {
  const { animalId, cause, causeOfDeath, date } = req.body;

  if (!animalId || !cause || !causeOfDeath || !date) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  // 1. Get animal info (farm + pen)
  const getAnimalQuery = "SELECT farm, pen FROM animals WHERE tag = ?";
  db.query(getAnimalQuery, [animalId], (err, results) => {
    if (err) {
      console.error("Error fetching animal:", err);
      return res.status(500).json({ message: "Error fetching animal data" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Animal not found" });
    }

    const { farm, pen } = results[0];
    const location = `Pen ${pen}, Farm ${farm}`;

    // 2. Insert death record
    const insertDeathQuery = `
      INSERT INTO death_records (animal_id, cause_of_death, major_cause, date, location)
      VALUES (?, ?, ?, ?, ?)
    `;
    db.query(insertDeathQuery, [animalId, cause, causeOfDeath, date, location], (err) => {
      if (err) {
        console.error("Error inserting death record:", err);
        return res.status(500).json({ message: "Failed to save death record" });
      }

      // 3. Update animal status to 'Inactive'
      const updateStatusQuery = `UPDATE animals SET status = 'Inactive' WHERE tag = ?`;
      db.query(updateStatusQuery, [animalId], (err) => {
        if (err) {
          console.error("Error updating animal status:", err);
          return res.status(500).json({ message: "Death record saved, but failed to update animal status" });
        }

        res.status(200).json({
          message: "Death record saved successfully and animal marked as Inactive",
          farm,
          pen,
        });
      });
    });
  });
};

module.exports = {
  addDeathRecord,
};
