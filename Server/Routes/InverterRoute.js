const express = require('express');
const {  registerInvester} = require('../Controllers/InverterController');
const router = express.Router();


router.post('/invester/register', registerInvester);

module.exports = router;