const express = require('express');
const {  RegisterIncident } =  require('../Controllers/Incident_Controler')
const router = express.Router();



router.post('/Register/incident' ,  RegisterIncident);



module.exports = router;