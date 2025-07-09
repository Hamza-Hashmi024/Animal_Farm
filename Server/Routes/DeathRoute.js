const express = require('express');
const router = express.Router();
const { addDeathRecord } = require('../Controllers/Death_Controller');

// Route to add a death record
router.post('/death-records', addDeathRecord);

module.exports = router;