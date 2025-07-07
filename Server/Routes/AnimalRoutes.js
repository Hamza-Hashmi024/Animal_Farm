const express = require('express');
const router = express.Router();
const { registerAnimal, GetAllAnimals , getAnimalsWithCheckpoints
,  createCheckpointRecord ,registerBreed , GetAllBreeds} = require('../Controllers/Animal_controller');

router.post('/animals/register', registerAnimal);
router.get('/animals', GetAllAnimals);
router.get("/with-checkpoints", getAnimalsWithCheckpoints);
router.post("/checkpoints/:checkpointId/record", createCheckpointRecord);
router.post('/breeds/register', registerBreed);
router.get('/breeds', GetAllBreeds  );

module.exports = router;