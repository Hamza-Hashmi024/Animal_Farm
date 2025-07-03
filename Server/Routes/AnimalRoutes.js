const express = require('express');
const router = express.Router();
const { registerAnimal, GetAllAnimals } = require('../Controllers/Animal_controller');

router.post('/animals/register', registerAnimal);
router.get('/animals', GetAllAnimals);

module.exports = router;