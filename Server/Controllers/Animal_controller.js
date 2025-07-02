const db = require("../config/db");

 const registerAnimal = async (req, res) => {
  try {
    const {
      tag, srNo, breed, coatColor, age,
      arrivalWeight, purchaseDate, price, ratePerKg,
      mandi, purchaser, farm, pen,
      investor, doctor, status
    } = req.body;

    const query = `
      INSERT INTO animals (
        tag, sr_no, breed, coat_color, age,
        arrival_weight, purchase_date, price, rate_per_kg,
        mandi, purchaser, farm, pen,
        investor, doctor, status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      tag, srNo, breed, coatColor || null, age || 0,
      arrivalWeight, purchaseDate, price, ratePerKg || 0,
      mandi || null, purchaser || null, farm, pen,
      investor || null, doctor || null, status || "Active"
    ];

    await db.execute(query, values);

    res.status(201).json({ message: "Animal registered successfully." });
  } catch (err) {
    console.error("Error inserting animal:", err);
    res.status(500).json({ message: "Server error" });
  }
}; 


module.exports = {
  registerAnimal
};