const express = require('express');
const {  registerInvester , InvesterName,  getAllInvestors  ,  getInvestorById} = require('../Controllers/InverterController');
const router = express.Router();


router.post('/invester/register', registerInvester);
router.get('/invester/names',   InvesterName );
router.get('/invester',   getAllInvestors );
router.get('/invester/:id',   getInvestorById);





module.exports = router;