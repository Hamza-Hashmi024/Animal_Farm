const express = require('express');
const router = express.Router();
const {RecordSlaughter , View_Record_Slaughter } = require("../Controllers/SlaughterRecords")

router.post('/record/slaughter' , RecordSlaughter);
router.get('/stats/view', View_Record_Slaughter);


module.exports = router;