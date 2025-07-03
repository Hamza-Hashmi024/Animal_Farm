const express = require('express');
const {  registerInvester , InvesterName } = require('../Controllers/InverterController');
const router = express.Router();


router.post('/invester/register', registerInvester);
router.get('/invester/names',   InvesterName );



module.exports = router;