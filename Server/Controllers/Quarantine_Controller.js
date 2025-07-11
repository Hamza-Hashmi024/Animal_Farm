const db = require("../config/db"); 
const moment = require("moment"); 

//  const QuarantineAnimal = async (req, res) => {
//   const {
//     animal_tag,
//     reason,
//     quarantine_start_date,
//     quarantine_end_date,
//     notes,
//     pen,
//     farm,
//     changed_by,
//   } = req.body;

//   try {
//     // 1. Start transaction
//     db.beginTransaction(async (err) => {
//       if (err) return res.status(500).json({ message: "Transaction error", error: err });

//       // 2. Get current status
//       db.query(
//         "SELECT status FROM animals WHERE tag = ?",
//         [animal_tag],
//         (err, result) => {
//           if (err) return db.rollback(() => res.status(500).json({ message: "Failed to fetch animal", error: err }));

//           if (result.length === 0) {
//             return db.rollback(() =>
//               res.status(404).json({ message: "Animal not found" })
//             );
//           }

//           const previous_status = result[0].status;

//           // 3. Insert into quarantine_animals
//           const insertQuarantineQuery = `
//             INSERT INTO quarantine_animals 
//             (animal_tag, reason, quarantine_start_date, quarantine_end_date, notes, pen, farm)
//             VALUES (?, ?, ?, ?, ?, ?, ?)
//           `;

//           db.query(
//             insertQuarantineQuery,
//             [
//               animal_tag,
//               reason,
//               quarantine_start_date,
//               quarantine_end_date || null,
//               notes || null,
//               pen || null,
//               farm || null,
//             ],
//             (err, quarantineResult) => {
//               if (err) {
//                 return db.rollback(() =>
//                   res.status(500).json({ message: "Failed to insert quarantine data", error: err })
//                 );
//               }

//               const reference_id = quarantineResult.insertId;

//               // 4. Update animal status to "Inactive"
//               db.query(
//                 "UPDATE animals SET status = 'Inactive' WHERE tag = ?",
//                 [animal_tag],
//                 (err) => {
//                   if (err) {
//                     return db.rollback(() =>
//                       res.status(500).json({ message: "Failed to update animal status", error: err })
//                     );
//                   }

//                   // 5. Insert into status_history
//                   const insertHistoryQuery = `
//                     INSERT INTO status_history 
//                     (animal_tag, previous_status, new_status, changed_by, change_reason, reference_id)
//                     VALUES (?, ?, ?, ?, ?, ?)
//                   `;

//                   db.query(
//                     insertHistoryQuery,
//                     [
//                       animal_tag,
//                       previous_status,
//                       "Inactive",
//                       changed_by || "System",
//                       "Quarantine",
//                       reference_id,
//                     ],
//                     (err) => {
//                       if (err) {
//                         return db.rollback(() =>
//                           res.status(500).json({ message: "Failed to insert status history", error: err })
//                         );
//                       }

//                       // 6. Commit transaction
//                       db.commit((err) => {
//                         if (err) {
//                           return db.rollback(() =>
//                             res.status(500).json({ message: "Commit failed", error: err })
//                           );
//                         }

//                         return res.status(201).json({
//                           message: `Animal ${animal_tag} quarantined successfully.`,
//                           quarantine_id: reference_id,
//                         });
//                       });
//                     }
//                   );
//                 }
//               );
//             }
//           );
//         }
//       );
//     });
//   } catch (error) {
//     console.error("Unexpected error:", error);
//     res.status(500).json({ message: "Server error", error });
//   }
// };


// Get Qurantine 


const QuarantineAnimal = async (req, res) => {
  const {
    animal_tag,
    reason,
    quarantine_start_date,
    quarantine_end_date,
    notes,
    pen,
    farm,
    changed_by,
  } = req.body;

  try {
    db.beginTransaction((err) => {
      if (err) return res.status(500).json({ message: "Transaction error", error: err });

      db.query("SELECT status FROM animals WHERE tag = ?", [animal_tag], (err, result) => {
        if (err) return db.rollback(() => res.status(500).json({ message: "Failed to fetch animal", error: err }));

        if (result.length === 0) {
          return db.rollback(() => res.status(404).json({ message: "Animal not found" }));
        }

        const previous_status = result[0].status;

        const insertQuarantineQuery = `
          INSERT INTO quarantine_animals 
          (animal_tag, reason, quarantine_start_date, quarantine_end_date, notes, pen, farm)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(
          insertQuarantineQuery,
          [
            animal_tag,
            reason,
            quarantine_start_date,
            quarantine_end_date || null,
            notes || null,
            pen || null,
            farm || null,
          ],
          (err, quarantineResult) => {
            if (err) {
              return db.rollback(() => res.status(500).json({ message: "Failed to insert quarantine data", error: err }));
            }

            const reference_id = quarantineResult.insertId;

            db.query("UPDATE animals SET status = 'Inactive' WHERE tag = ?", [animal_tag], (err) => {
              if (err) {
                return db.rollback(() => res.status(500).json({ message: "Failed to update animal status", error: err }));
              }

              const insertHistoryQuery = `
                INSERT INTO status_history 
                (animal_tag, previous_status, new_status, changed_by, change_reason, reference_id)
                VALUES (?, ?, ?, ?, ?, ?)
              `;

              db.query(
                insertHistoryQuery,
                [
                  animal_tag,
                  previous_status,
                  "Inactive",
                  changed_by || "System",
                  "Manual", // ✅ Use a valid enum value here
                  reference_id,
                ],
                (err) => {
                  if (err) {
                    return db.rollback(() => res.status(500).json({ message: "Failed to insert status history", error: err }));
                  }

                  db.commit((err) => {
                    if (err) {
                      return db.rollback(() => res.status(500).json({ message: "Commit failed", error: err }));
                    }

                    return res.status(201).json({
                      message: `Animal ${animal_tag} quarantined successfully.`,
                      quarantine_id: reference_id,
                    });
                  });
                }
              );
            });
          }
        );
      });
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
const GetQuarantineRecords = async (req, res) => {
  try {
    const { animal_tag, quarantine_start_date, quarantine_end_date, notes    } = req.query;

    // Base query
    let query = `
      SELECT animal_tag, quarantine_start_date, quarantine_end_date, notes
      FROM quarantine_animals
      WHERE 1 = 1
    `;
    const params = [];

    // Add filters if present
    if (animal_tag) {
      query += " AND animal_tag = ?";
      params.push(animal_tag);
    }

    if (quarantine_start_date) {
      query += " AND quarantine_start_date >= ?";
      params.push(quarantine_start_date);
    }

    if (quarantine_end_date) {
      query += " AND quarantine_end_date <= ?";
      params.push(quarantine_end_date);
    }

    if (notes) {
      query += " AND notes LIKE ?";
      params.push(`%${notes}%`);
    }

    // Execute query
    db.query(query, params, (err, results) => {
      if (err) {
        console.error("Error fetching quarantine records:", err);
        return res.status(500).json({ message: "Failed to fetch records", error: err });
      }

      return res.status(200).json({
        message: "Quarantine records fetched successfully",
        data: results,
      });
    });

  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};






module.exports = {
     QuarantineAnimal,
     GetQuarantineRecords
}
