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
const   createCheckpointRecord = async (req, res) => {
  const { checkpointId } = req.params;
  const { check_date, weight_kg, notes } = req.body;

  if (!check_date) {
    return res.status(400).json({ error: "Check date is required" });
  }

  try {
    // 1. Insert record
    const [result] = await db
      .promise()
      .query(
        `INSERT INTO checkpoint_records (checkpoint_id, check_date, weight_kg, notes) VALUES (?, ?, ?, ?)`,
        [checkpointId, check_date, weight_kg || null, notes || null]
      );

    const recordId = result.insertId;

    // 2. Update checkpoint's completed_at field (if needed)
    await db
      .promise()
      .query(
        `UPDATE animal_checkpoints SET completed_at = NOW(), record_id = ? WHERE checkpoint_id = ?`,
        [recordId, checkpointId]
      );

    res.status(201).json({
      message: "Checkpoint record created",
      recordId,
    });
  } catch (err) {
    console.error("Error creating checkpoint record:", err);
    res.status(500).json({ error: "Failed to create checkpoint record" });
  }
};



module.exports = {
  registerAnimal,
  GetAllAnimals,
  getAnimalsWithCheckpoints,
  createCheckpointRecord,
};
