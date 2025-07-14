const { create } = require("node:domain");
const db = require("../config/db");

const registerInvester = async (req, res) => {
  try {
    const { name, email, phone,  total_investment} = req.body;

    const query = `
      INSERT INTO investors (name, email, phone, total_investment)
      VALUES (?, ?, ?, ?)
    `;
    const values = [
      name.trim(),
      email.trim(),
      phone ? phone.trim() : null,
      Number( total_investment)
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

// GET all investors
const getAllInvestors = (req, res) => {
  db.query("SELECT * FROM investors", (err, results) => {
    if (err) {
      console.error("Error fetching investors:", err);
      return res.status(500).json({ error: "Failed to fetch investors." });
    }
    res.json(results);
  });
};

// GET investor by ID
const getInvestorById = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM investors WHERE id = ?", [id], (err, results) => {
    if (err) {
      console.error("Error fetching investor:", err);
      return res.status(500).json({ error: "Failed to fetch investor." });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Investor not found." });
    }
    res.json(results[0]);
  });
};




module.exports = {
  registerInvester,
  InvesterName,
   getAllInvestors ,
    getInvestorById
};
