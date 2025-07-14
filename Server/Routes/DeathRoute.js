const express = require("express");
const router = express.Router();
const { addDeathRecord, getAnimalById,  getAllDeathRecord,} = require("../Controllers/Death_Controller");

router.post("/death-records", addDeathRecord);
router.get("/animals/:id", getAnimalById);
router.get("/death/stats" ,  getAllDeathRecord);


module.exports = router;
