const db = require("../config/db");

const RegisterIncident = async (req, res) => {
  const { animalTag, incidentType, description, priority, farm, pen } =
    req.body;

  if (
    !animalTag ||
    !incidentType ||
    !description ||
    !priority ||
    !farm ||
    !pen
  ) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const insertQuery = `
      INSERT INTO animal_incidents 
        (animal_tag, incident_type, description, priority, farm, pen) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    await db
      .promise()
      .execute(insertQuery, [
        animalTag,
        incidentType,
        description,
        priority,
        farm,
        pen,
      ]);

    return res
      .status(201)
      .json({ message: "Incident registered successfully." });
  } catch (error) {
    console.error("Error registering incident:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

const getRecentIncidents = (req, res) => {
  db.query(
    `
      SELECT 
        id,
        animal_tag AS tag,
        incident_type AS type,
        farm,
        pen,
        description,
        priority,
        DATE(reported_at) AS date,
        'Unknown' AS status
      FROM animal_incidents
      ORDER BY reported_at DESC
      LIMIT 10
    `,
    (error, results) => {
      if (error) {
        console.error("Error fetching incidents:", error);
        return res.status(500).json({ message: "Internal Server Error" });
      }

      res.status(200).json(results);
    }
  );
};

module.exports = {
  RegisterIncident,
  getRecentIncidents,
};
