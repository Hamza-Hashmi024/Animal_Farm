const db = require("../config/db");

// This ChunkOf Code Register An animal AND aLSO Schedules Checkpoints
const registerAnimal = async (req, res) => {
  const {
    tag,
    srNo,
    breed,
    coatColor,
    age,
    arrivalWeight,
    purchaseDate,
    price,
    ratePerKg,
    mandi,
    purchaser,
    farm,
    pen,
    investor,
    doctor,
    status,
  } = req.body;

  db.beginTransaction(async (err) => {
    if (err) {
      console.error("Transaction Error:", err);
      return res.status(500).json({ message: "Transaction failed" });
    }

    try {
      // 1. Insert animal
      const insertAnimalQuery = `
        INSERT INTO animals (
          tag, sr_no, breed, coat_color, age,
          arrival_weight, purchase_date, price, rate_per_kg,
          mandi, purchaser, farm, pen,
          investor, doctor, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const animalValues = [
        tag,
        srNo,
        breed,
        coatColor || null,
        age || 0,
        arrivalWeight,
        purchaseDate,
        price,
        ratePerKg || 0,
        mandi || null,
        purchaser || null,
        farm,
        pen,
        investor || null,
        doctor || null,
        status || "Active",
      ];

      const [animalResult] = await db
        .promise()
        .execute(insertAnimalQuery, animalValues);
      const animalId = animalResult.insertId;

      // 2. Fetch templates
      const [templates] = await db
        .promise()
        .query(
          `SELECT template_id, day_offset FROM checkpoint_templates WHERE is_active = 1`
        );

      // 3. Prepare checkpoint values
      const checkpoints = templates.map(({ template_id, day_offset }) => {
        const scheduledDate = new Date(purchaseDate);
        scheduledDate.setDate(scheduledDate.getDate() + day_offset);
        return [
          animalId,
          template_id,
          scheduledDate.toISOString().split("T")[0],
        ];
      });

      // 4. Insert checkpoints if any
      if (checkpoints.length > 0) {
        await db
          .promise()
          .query(
            `INSERT INTO scheduled_checkpoints (animal_id, template_id, scheduled_date) VALUES ?`,
            [checkpoints]
          );
      }

      db.commit((commitErr) => {
        if (commitErr) {
          db.rollback(() => {
            console.error("Commit failed:", commitErr);
            return res.status(500).json({ message: "Commit failed" });
          });
        } else {
          res
            .status(201)
            .json({
              message:
                "Animal registered and checkpoints scheduled successfully.",
            });
        }
      });
    } catch (error) {
      db.rollback(() => {
        console.error("Transaction failed:", error);
        return res.status(500).json({ message: "Server error" });
      });
    }
  });
};

const GetAllAnimals = async (req, res) => {
  try {
    const query = "SELECT * FROM animals";
    db.execute(query, (err, results) => {
      if (err) {
        console.error("Error fetching animals:", err);
        return res.status(500).json({ message: "Server error" });
      }
      res.status(200).json(results);
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// The Chunk Of gET aNIMAL WITH  cHECK pOINTS
const getAnimalsWithCheckpoints = async (req, res) => {
  try {
    // 1. Fetch all active animals
    const [animals] = await db.promise().query(`
      SELECT * FROM animals WHERE status = 'Active'
    `);

    // 2. Fetch all checkpoints (from the view, with label, template, date, etc.)
    const [checkpoints] = await db.promise().query(`
      SELECT * FROM view_animal_checkpoints ORDER BY scheduled_date
    `);

    // 3. Map animal data by ID
    const animalMap = {};
    animals.forEach((animal) => {
      animalMap[animal.id] = { ...animal, checkpoints: [] };
    });

    // 4. Attach checkpoints to each animal by animal_id
    checkpoints.forEach((cp) => {
      if (animalMap[cp.animal_id]) {
        animalMap[cp.animal_id].checkpoints.push(cp);
      }
    });

    // 5. Send the final structured response
    res.json(Object.values(animalMap));
  } catch (err) {
    console.error("Error fetching animals with checkpoints:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// tHIS cHUNK oF CODE uPDATEING uPDATED wEIGHT OF aNIMAL 
// const createCheckpointRecord = async (req, res) => {
//   const { checkpointId } = req.params;
//   const {
//     check_date,
//     weight_kg,
//     notes,
//     vaccine,
//     dewormer,
//     medicines = []
//   } = req.body;

//   if (!check_date) {
//     return res.status(400).json({ error: "Check date is required" });
//   }

//   const connection = await db.getConnection();

//   try {
//     await connection.beginTransaction();

//     // 1. Insert into checkpoint_records
//     const [recordResult] = await connection.query(
//       `INSERT INTO checkpoint_records (checkpoint_id, check_date, weight_kg, notes)
//        VALUES (?, ?, ?, ?)`,
//       [checkpointId, check_date, weight_kg || null, notes || null]
//     );

//     const recordId = recordResult.insertId;

//     // 2. Update animal_checkpoints with completion
//     await connection.query(
//       `UPDATE animal_checkpoints SET completed_at = NOW(), record_id = ? WHERE checkpoint_id = ?`,
//       [recordId, checkpointId]
//     );

//     // 3. Build treatments
//     const treatments = [];

//     if (vaccine?.name) {
//       treatments.push([
//         recordId,
//         'vaccine',
//         vaccine.name,
//         vaccine.batch || null,
//         vaccine.dose || null,
//         null
//       ]);
//     }

//     if (dewormer?.name) {
//       treatments.push([
//         recordId,
//         'dewormer',
//         dewormer.name,
//         null,
//         dewormer.dose || null,
//         null
//       ]);
//     }

//     if (Array.isArray(medicines)) {
//       for (const med of medicines) {
//         if (med.name) {
//           treatments.push([
//             recordId,
//             'medicine',
//             med.name,
//             null,
//             med.dose || null,
//             null
//           ]);
//         }
//       }
//     }

//     // 4. Insert treatments if any
//     if (treatments.length > 0) {
//       await connection.query(
//         `INSERT INTO treatments (record_id, category, name, batch_no, dose, notes) VALUES ?`,
//         [treatments]
//       );
//     }

//     await connection.commit();

//     res.status(201).json({
//       message: "Checkpoint record and treatments saved",
//       recordId
//     });

//   } catch (err) {
//     await connection.rollback();
//     console.error(" Error in createCheckpointRecord:", err.message);
//     res.status(500).json({ error: "Failed to save checkpoint record" });
//   } finally {
//     connection.release(); 
//   }
// };

const createCheckpointRecord = async (req, res) => {
  const { checkpointId } = req.params;
  const {
    check_date,
    weight_kg,
    notes,
    vaccine,
    dewormer,
    medicines = []
  } = req.body;

  if (!check_date) {
    return res.status(400).json({ error: "Check date is required" });
  }

  const dbPromise = db.promise();

  try {
    await dbPromise.query('START TRANSACTION');

    // 1. Insert into checkpoint_records
    const [recordResult] = await dbPromise.query(
      `INSERT INTO checkpoint_records (checkpoint_id, check_date, weight_kg, notes)
       VALUES (?, ?, ?, ?)`,
      [checkpointId, check_date, weight_kg || null, notes || null]
    );

    const recordId = recordResult.insertId;

    // 2. Update scheduled_checkpoints with record info
    await dbPromise.query(
      `UPDATE scheduled_checkpoints SET completed_at = NOW(), record_id = ? WHERE checkpoint_id = ?`,
      [recordId, checkpointId]
    );

    // 3. Prepare treatments
    const treatments = [];

    if (vaccine?.name) {
      treatments.push([
        recordId,
        'vaccine',
        vaccine.name,
        vaccine.batch || null,
        vaccine.dose || null,
        null
      ]);
    }

    if (dewormer?.name) {
      treatments.push([
        recordId,
        'dewormer',
        dewormer.name,
        null,
        dewormer.dose || null,
        null
      ]);
    }

    for (const med of medicines) {
      if (med.name) {
        treatments.push([
          recordId,
          'medicine',
          med.name,
          null,
          med.dose || null,
          null
        ]);
      }
    }

    // 4. Insert treatments
    if (treatments.length > 0) {
      await dbPromise.query(
        `INSERT INTO treatments (record_id, category, name, batch_no, dose, notes) VALUES ?`,
        [treatments]
      );
    }

    // 5. Commit transaction
    await dbPromise.query('COMMIT');

    res.status(201).json({
      message: "Checkpoint record and treatments saved",
      recordId
    });

  } catch (err) {
    await dbPromise.query('ROLLBACK');
    console.error("Error in createCheckpointRecord:", err.message);
    res.status(500).json({ error: "Failed to save checkpoint record" });
  }
};



// rEGISTER bREAD 

const registerBreed = (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Breed name is required" });
  } else if (!description) {
    return res.status(400).json({ error: "Breed description is required" });
  }

  const query = "INSERT INTO breeds (name, description) VALUES (?, ?)";
  const values = [name, description];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error registering breed:", err);
      return res.status(500).json({ message: "Server error" });
    }

    res.status(201).json({
      message: "Breed registered successfully",
      breedId: result.insertId,
    });
  });
};



module.exports = {
  registerAnimal,
  GetAllAnimals,
  getAnimalsWithCheckpoints,
  createCheckpointRecord,
  registerBreed
};
