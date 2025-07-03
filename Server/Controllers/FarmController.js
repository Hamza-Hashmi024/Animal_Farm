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
module.exports = {
  registerFarm
};
