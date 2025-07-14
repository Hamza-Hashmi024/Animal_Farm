const express = require('express');
const { registerFarm , farm_number  , 
    Get_All_Farm 
} = require('../Controllers/FarmController');
const router = express.Router();


router.post('/farm/register', registerFarm);
router.get('/farm/numbers', farm_number);
router.get('/farm' , Get_All_Farm);

module.exports = router;