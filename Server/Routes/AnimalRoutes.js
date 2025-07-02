const express = require('express');
const router = express.Router();
const { registerAnimal } = require('../Controllers/Animal_controller');

router.post('/animals/register', registerAnimal);

module.exports = router;