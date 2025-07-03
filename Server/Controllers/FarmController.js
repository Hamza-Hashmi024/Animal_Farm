const db = require("../config/db");

const registerFarm = async (req, res) => {
  try {
    console.log("Incoming Data:", req.body);

    const {
      farmNumber,
      address,
      numberOfPens,
      area,
      startDate,
    } = req.body;

    if (
      !farmNumber ||
      !address ||
      !numberOfPens ||
      !area ||
      !startDate
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const query = `
      INSERT INTO farms (
        farm_number, address, number_of_pens, area, start_date
      ) VALUES (?, ?, ?, ?, ?)
    `;

    const values = [
      farmNumber,
      address,
      numberOfPens,
      area,
      startDate,
    ];

    await db.execute(query, values);

    res.status(202).json({ message: "Farm Registered Successfully" });
  } catch (err) {
    console.error("Error inserting farm:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const farm_number = (req, res) => {
  const query = `SELECT farm_number FROM farms`;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching farm numbers:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (!results || results.length === 0) {
      return res.status(404).json({ message: "No farms found" });
    }

    res.status(200).json(results);
  });
};


module.exports = {
  registerFarm,
  farm_number
};
