const express = require('express');
const {  RegisterIncident , getRecentIncidents } =  require('../Controllers/Incident_Controler')
const router = express.Router();



router.post('/Register/incident' ,  RegisterIncident);
router.get("/recent", getRecentIncidents);



module.exports = router;