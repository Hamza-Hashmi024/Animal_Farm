const db = require("../config/db");

//  const registerAnimal = async (req, res) => {
//   try {
//     const {
//       tag, srNo, breed, coatColor, age,
//       arrivalWeight, purchaseDate, price, ratePerKg,
//       mandi, purchaser, farm, pen,
//       investor, doctor, status
//     } = req.body;

//     const query = `
//       INSERT INTO animals (
//         tag, sr_no, breed, coat_color, age,
//         arrival_weight, purchase_date, price, rate_per_kg,
//         mandi, purchaser, farm, pen,
//         investor, doctor, status
//       )
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `;

//     const values = [
//       tag, srNo, breed, coatColor || null, age || 0,
//       arrivalWeight, purchaseDate, price, ratePerKg || 0,
//       mandi || null, purchaser || null, farm, pen,
//       investor || null, doctor || null, status || "Active"
//     ];

//     await db.execute(query, values);

//     res.status(201).json({ message: "Animal registered successfully." });
//   } catch (err) {
//     console.error("Error inserting animal:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// }; 


const registerAnimal = async (req, res) => {
  const {
    tag, srNo, breed, coatColor, age,
    arrivalWeight, purchaseDate, price, ratePerKg,
    mandi, purchaser, farm, pen,
    investor, doctor, status
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
        tag, srNo, breed, coatColor || null, age || 0,
        arrivalWeight, purchaseDate, price, ratePerKg || 0,
        mandi || null, purchaser || null, farm, pen,
        investor || null, doctor || null, status || "Active"
      ];

      const [animalResult] = await db.promise().execute(insertAnimalQuery, animalValues);
      const animalId = animalResult.insertId;

      // 2. Fetch templates
      const [templates] = await db.promise().query(
        `SELECT template_id, day_offset FROM checkpoint_templates WHERE is_active = 1`
      );

      // 3. Prepare checkpoint values
      const checkpoints = templates.map(({ template_id, day_offset }) => {
        const scheduledDate = new Date(purchaseDate);
        scheduledDate.setDate(scheduledDate.getDate() + day_offset);
        return [animalId, template_id, scheduledDate.toISOString().split('T')[0]];
      });

      // 4. Insert checkpoints if any
      if (checkpoints.length > 0) {
        await db.promise().query(
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
          res.status(201).json({ message: "Animal registered and checkpoints scheduled successfully." });
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


module.exports = {
  registerAnimal,
  GetAllAnimals
};