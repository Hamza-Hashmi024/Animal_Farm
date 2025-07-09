const express = require('express');
const router = express.Router();
const { addDeathRecord, getAnimalById } = require('../Controllers/Death_Controller');

// 1. Add death record
router.post('/death-records', addDeathRecord);

// 2. Get animal info by ID (tag)
router.get('/animals/:id', getAnimalById);

module.exports = router;