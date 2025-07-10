const db = require("../config/db"); 


// it will record the death and also change the status on Animal 
const addDeathRecord = (req, res) => {
  const { animalId, cause, causeOfDeath, date, changedBy = null } = req.body;

  if (!animalId || !cause || !causeOfDeath || !date) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  // Step 1: Get farm, pen, and current status of the animal
  const getAnimalQuery = "SELECT farm, pen, status FROM animals WHERE tag = ?";
  db.query(getAnimalQuery, [animalId], (err, results) => {
    if (err) {
      console.error("Error fetching animal:", err);
      return res.status(500).json({ message: "Error fetching animal data" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Animal not found" });
    }

    const { farm, pen, status: previousStatus } = results[0];
    const location = `Pen ${pen}, Farm ${farm}`;

    // Step 2: Insert into death_records
    const insertDeathQuery = `
      INSERT INTO death_records (animal_id, cause_of_death, major_cause, date, location)
      VALUES (?, ?, ?, ?, ?)
    `;
    db.query(insertDeathQuery, [animalId, cause, causeOfDeath, date, location], (err, result) => {
      if (err) {
        console.error("Error inserting death record:", err);
        return res.status(500).json({ message: "Failed to save death record" });
      }

      const deathId = result.insertId;

      // Step 3: Update animal status to 'Inactive'
      const updateStatusQuery = `UPDATE animals SET status = 'Inactive' WHERE tag = ?`;
      db.query(updateStatusQuery, [animalId], (err) => {
        if (err) {
          console.error("Error updating animal status:", err);
          return res.status(500).json({ message: "Death recorded, but failed to update animal status" });
        }

        // Step 4: Log the status change in status_history
        const insertStatusHistoryQuery = `
          INSERT INTO status_history (
            animal_tag, previous_status, new_status, changed_by, change_reason, reference_id
          ) VALUES (?, ?, ?, ?, 'Death', ?)
        `;
        db.query(
          insertStatusHistoryQuery,
          [animalId, previousStatus, 'Inactive', changedBy, deathId],
          (err) => {
            if (err) {
              console.error("Error inserting status history:", err);
              return res.status(500).json({ message: "Status updated, but history not recorded" });
            }

            // Final success response
            res.status(200).json({
              message: "Death record, status update, and history log completed successfully",
              farm,
              pen,
              deathId,
            });
          }
        );
      });
    });
  });
};


// It will Fetch only id Of those Animal That ARE active
const getAnimalById = (req, res) => {
  const { id } = req.params;

  const query = "SELECT farm, pen FROM animals WHERE tag = ? AND status = 'Active'";
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("DB Error while fetching animal info:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Active animal not found" });
    }

    const { farm, pen } = results[0];
    res.status(200).json({ farm, pen });
  });
};
module.exports = {
  addDeathRecord,
    getAnimalById,

};
