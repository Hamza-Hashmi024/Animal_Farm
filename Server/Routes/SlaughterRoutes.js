const express = require('express');
const router = express.Router();
const {   RecordSlaughter , View_Record_Slaughter , View_Recent_Slaughter_Records }  = require("../Controllers/SlaughterRecords");

router.post('/record/slaughter' , RecordSlaughter);
router.get('/stats/view', View_Record_Slaughter);
router.get('/slaughter/records/recent',  View_Recent_Slaughter_Records );

module.exports = router;