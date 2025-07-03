const express = require('express');
const { registerFarm , farm_number } = require('../Controllers/FarmController');
const router = express.Router();


router.post('/farm/register', registerFarm);
router.get('/farm/numbers', farm_number);

module.exports = router;