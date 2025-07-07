const express = require('express');
const router = express.Router();
const { registerAnimal, GetAllAnimals , getAnimalsWithCheckpoints
,  createCheckpointRecord ,registerBreed} = require('../Controllers/Animal_controller');

router.post('/animals/register', registerAnimal);
router.get('/animals', GetAllAnimals);
router.get("/with-checkpoints", getAnimalsWithCheckpoints);
router.post("/checkpoints/:checkpointId/record", createCheckpointRecord);
router.post('/breeds/register', registerBreed);

module.exports = router;