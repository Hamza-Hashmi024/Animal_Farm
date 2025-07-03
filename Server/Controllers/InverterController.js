const db = require("../config/db");

const registerInvester = async (req, res) => {
  try {
    const { name, email, phone, totalInvestment } = req.body;

    const query = `
      INSERT INTO investors (name, email, phone, total_investment)
      VALUES (?, ?, ?, ?)
    `;
    const values = [
      name.trim(),
      email.trim(),
      phone ? phone.trim() : null,
      Number(totalInvestment)
    ];

    await db.execute(query, values);

    res.status(201).json({ message: "Investor registered successfully" });
  } catch (error) {
    console.error("Error registering investor:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


const InvesterName = (req, res) => {
  const query = `SELECT name FROM investors`;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching investors:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (!results || results.length === 0) {
      return res.status(404).json({ message: "No investors found" });
    }

    res.status(200).json(results);
  });
};






module.exports = {
  registerInvester,
  InvesterName
};
