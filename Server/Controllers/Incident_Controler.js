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

module.exports = {
  RegisterIncident,
};
