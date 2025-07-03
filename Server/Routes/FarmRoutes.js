const express = require('express');
const { registerFarm } = require('../Controllers/FarmController');
const router = express.Router();


router.post('/farm/register', registerFarm);

module.exports = router;