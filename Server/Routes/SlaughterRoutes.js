const express = require('express');
const router = express.Router();
const {RecordSlaughter} = require("../Controllers/SlaughterRecords")

router.post('/record/slaughter' , RecordSlaughter)


module.exports = router;