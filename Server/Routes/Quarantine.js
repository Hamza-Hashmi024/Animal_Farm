const express = require("express");
const { QuarantineAnimal , GetQuarantineRecords } = require("../Controllers/Quarantine_Controller");

const router = express.Router();

router.post("/quarantine", QuarantineAnimal);
router.get("/quarantine", GetQuarantineRecords);

module.exports = router;