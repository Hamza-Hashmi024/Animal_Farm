const express = require('express');
const router = express.Router();
const { registerAnimal, GetAllAnimals , getAnimalsWithCheckpoints  ,  createCheckpointRecord} = require('../Controllers/Animal_controller');

router.post('/animals/register', registerAnimal);
router.get('/animals', GetAllAnimals);
router.get("/with-checkpoints", getAnimalsWithCheckpoints);
router.post("/api/checkpoints/:checkpointId/record", createCheckpointRecord);

module.exports = router;