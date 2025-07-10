const db = require("../config/db")

const RecordSlaughter = (req, res) => {
  const {
    animalTag,
    slaughterDate,
    weightBeforeSlaughter,
    finalWeightGain,
    carcassWeight,
    carcassRatio,
    carcassQuality,
    qualityNotes = null,
    customerFeedback = null,
    changedBy = null
  } = req.body;

  // Validate required fields
  if (
    !animalTag ||
    !slaughterDate ||
    !weightBeforeSlaughter ||
    !finalWeightGain ||
    !carcassWeight ||
    !carcassQuality
  ) {
    return res.status(400).json({ message: "Missing required slaughter fields" });
  }

  // Step 1: Get current status of the animal
  const getAnimalQuery = "SELECT status FROM animals WHERE tag = ?";
  db.query(getAnimalQuery, [animalTag], (err, results) => {
    if (err) {
      console.error("Error fetching animal status:", err);
      return res.status(500).json({ message: "Error fetching animal data" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Animal not found" });
    }

    const previousStatus = results[0].status;

    // Step 2: Insert into slaughter_records
    const insertSlaughterQuery = `
      INSERT INTO slaughter_records (
        animal_tag, slaughter_date, weight_before_slaughter,
        final_weight_gain, carcass_weight, carcass_ratio,
        carcass_quality, quality_notes, customer_feedback
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const slaughterData = [
      animalTag,
      slaughterDate,
      weightBeforeSlaughter,
      finalWeightGain,
      carcassWeight,
      carcassRatio,
      carcassQuality,
      qualityNotes,
      customerFeedback
    ];

    db.query(insertSlaughterQuery, slaughterData, (err, result) => {
      if (err) {
        console.error("Error inserting slaughter record:", err);
        return res.status(500).json({ message: "Failed to save slaughter record" });
      }

      const slaughterId = result.insertId;

      // Step 3: Update animal status to 'Inactive'
      const updateStatusQuery = `UPDATE animals SET status = 'Inactive' WHERE tag = ?`;
      db.query(updateStatusQuery, [animalTag], (err) => {
        if (err) {
          console.error("Error updating animal status:", err);
          return res.status(500).json({ message: "Slaughter recorded, but failed to update status" });
        }

        // Step 4: Log in status_history
        const insertStatusHistoryQuery = `
          INSERT INTO status_history (
            animal_tag, previous_status, new_status, changed_by, change_reason, reference_id
          ) VALUES (?, ?, ?, ?, 'Slaughter', ?)
        `;
        const historyData = [
          animalTag,
          previousStatus,
          'Inactive',
          changedBy,
          slaughterId
        ];

        db.query(insertStatusHistoryQuery, historyData, (err) => {
          if (err) {
            console.error("Error inserting status history:", err);
            return res.status(500).json({ message: "Status updated, but history not recorded" });
          }

          res.status(200).json({
            message: "Slaughter record, status update, and history log completed successfully",
            slaughterId,
          });
        });
      });
    });
  });

};


module.exports ={
    RecordSlaughter,
}