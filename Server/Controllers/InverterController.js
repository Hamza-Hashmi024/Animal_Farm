const db = require("../config/db");

const registerInvester = async (req, res) => {
  try {
    const { name, email, phone, totalInvestment } = req.body;

   

    const id = "INV-" + Date.now(); // Auto-generate unique ID

    const query = `
      INSERT INTO investors (id, name, email, phone, total_investment)
      VALUES (?, ?, ?, ?, ?)
    `;
    const values = [id, name.trim(), email.trim(), phone.trim(), Number(totalInvestment)];

    await db.execute(query, values);

    res.status(201).json({ message: "Investor registered successfully" });
  } catch (error) {
    console.error("Error registering investor:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  registerInvester
};
