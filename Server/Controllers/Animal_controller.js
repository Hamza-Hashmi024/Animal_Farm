const db = require("../config/db");

// This ChunkOf Code Register An animal AND aLSO Schedules Checkpoints
const registerAnimal = async (req, res) => {
  const {
    tag,
    srNo,
    breed,
    coatColor,
    age,
    purchaseDate,
    price,
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
           purchase_date, price, 
          mandi, purchaser, farm, pen,
          investor, doctor, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const animalValues = [
        tag,
        srNo,
        breed,
        coatColor || null,
        age || 0,
        purchaseDate,
        price,
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

//   const dbPromise = db.promise();

//   try {
//     await dbPromise.query('START TRANSACTION');

//     // 1. Insert into checkpoint_records
//     const [recordResult] = await dbPromise.query(
//       `INSERT INTO checkpoint_records (checkpoint_id, check_date, weight_kg, notes)
//        VALUES (?, ?, ?, ?)`,
//       [checkpointId, check_date, weight_kg || null, notes || null]
//     );

//     const recordId = recordResult.insertId;

//     // 2. Update scheduled_checkpoints with record info
//     await dbPromise.query(
//       `UPDATE scheduled_checkpoints SET completed_at = NOW(), record_id = ? WHERE checkpoint_id = ?`,
//       [recordId, checkpointId]
//     );

//     // 3. Prepare treatments
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

//     for (const med of medicines) {
//       if (med.name) {
//         treatments.push([
//           recordId,
//           'medicine',
//           med.name,
//           null,
//           med.dose || null,
//           null
//         ]);
//       }
//     }

//     // 4. Insert treatments
//     if (treatments.length > 0) {
//       await dbPromise.query(
//         `INSERT INTO treatments (record_id, category, name, batch_no, dose, notes) VALUES ?`,
//         [treatments]
//       );
//     }

//     // 5. Commit transaction
//     await dbPromise.query('COMMIT');

//     res.status(201).json({
//       message: "Checkpoint record and treatments saved",
//       recordId
//     });

//   } catch (err) {
//     await dbPromise.query('ROLLBACK');
//     console.error("Error in createCheckpointRecord:", err.message);
//     res.status(500).json({ error: "Failed to save checkpoint record" });
//   }
// };



// rEGISTER bREAD 


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

    // 5. Weight history logic starts here

    // Get animal_id from checkpoint
    const [[checkpointRow]] = await dbPromise.query(
      `SELECT animal_id FROM scheduled_checkpoints WHERE checkpoint_id = ?`,
      [checkpointId]
    );
    const animalId = checkpointRow.animal_id;

    // Fetch all past weight records (including this one)
    const [historyRows] = await dbPromise.query(
      `
      SELECT cr.check_date, cr.weight_kg
      FROM checkpoint_records cr
      JOIN scheduled_checkpoints sc ON cr.checkpoint_id = sc.checkpoint_id
      WHERE sc.animal_id = ?
      ORDER BY cr.check_date ASC
      `,
      [animalId]
    );

    let weightDiff = null;
    let daysSince = null;
    let adg = null;
    let overallAdg = null;

    const currentIndex = historyRows.findIndex(
      row => row.check_date.toISOString().split('T')[0] === check_date
    );

    if (currentIndex > 0) {
      const prev = historyRows[currentIndex - 1];
      weightDiff = parseFloat(weight_kg) - parseFloat(prev.weight_kg);
      const diffDays = Math.ceil(
        (new Date(check_date) - new Date(prev.check_date)) / (1000 * 60 * 60 * 24)
      );
      daysSince = diffDays;
      adg = diffDays > 0 ? parseFloat((weightDiff / diffDays).toFixed(2)) : null;
    }

    const first = historyRows[0];
    const totalDays = Math.ceil(
      (new Date(check_date) - new Date(first.check_date)) / (1000 * 60 * 60 * 24)
    );
    const totalDiff = parseFloat(weight_kg) - parseFloat(first.weight_kg);
    overallAdg = totalDays > 0 ? parseFloat((totalDiff / totalDays).toFixed(2)) : null;

    // Insert into animal_weight_history
    await dbPromise.query(
      `INSERT INTO animal_weight_history 
       (animal_id, check_date, weight_kg, weight_diff, days_since_last, adg, overall_adg)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        animalId,
        check_date,
        weight_kg,
        weightDiff,
        daysSince,
        adg,
        overallAdg
      ]
    );

    // 6. Commit transaction
    await dbPromise.query('COMMIT');

    res.status(201).json({
      message: "Checkpoint record, treatments, and weight history saved",
      recordId
    });

  } catch (err) {
    await dbPromise.query('ROLLBACK');
    console.error("Error in createCheckpointRecord:", err.message);
    res.status(500).json({ error: "Failed to save checkpoint record" });
  }
};


const registerBreed = (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Breed name is required" });
  } else if (!description) {
    return res.status(400).json({ error: "Breed description is required" });
  }

  const query = "INSERT INTO animal_breeds (name, description) VALUES (?, ?)";
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

const GetAllBreeds = (req, res) => {
  const query = "SELECT * FROM animal_breeds";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching breeds:", err);
      return res.status(500).json({ message: "Server error" });
      }
      res.json(results);
      });
      };

const getFilteredAnimals = async (req, res) => {
  try {
    const { minWeight = 0, maxWeight = 99999, farm, pen } = req.query;

    const conditions = [];
    const values = [];

    // Weight filter with NULL safety
    conditions.push("COALESCE(cr.weight_kg, 0) BETWEEN ? AND ?");
    values.push(minWeight, maxWeight);

    if (farm && farm !== "all") {
      conditions.push("LOWER(a.farm) = LOWER(?)");
      values.push(farm);
    }

    if (pen && pen !== "all") {
      conditions.push("LOWER(a.pen) = LOWER(?)");
      values.push(pen);
    }

    const sql = `
      SELECT 
        a.id,
        a.tag,
        a.breed,
        a.farm,
        a.pen,
        cr.weight_kg AS weight,
        a.adg
      FROM animals a
      LEFT JOIN scheduled_checkpoints sc ON sc.animal_id = a.id
      LEFT JOIN (
        SELECT cr1.*
        FROM checkpoint_records cr1
        JOIN (
          SELECT checkpoint_id, MAX(check_date) AS max_date
          FROM checkpoint_records
          GROUP BY checkpoint_id
        ) cr2 ON cr1.checkpoint_id = cr2.checkpoint_id AND cr1.check_date = cr2.max_date
      ) cr ON cr.checkpoint_id = sc.checkpoint_id
      ${conditions.length ? `WHERE ${conditions.join(" AND ")}` : ""}
    `;

    const [rows] = await db.promise().execute(sql, values);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching filtered animals:", err);
    res.status(500).json({ message: "Server error" });
  }
};



module.exports = {
  registerAnimal,
  GetAllAnimals,
  getAnimalsWithCheckpoints,
  createCheckpointRecord,
  registerBreed,
  GetAllBreeds,
  getFilteredAnimals
};
