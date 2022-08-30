const express = require('express');


const {
  addFarm,
  allFarm,
  isBooked,
  allBookedFarm,
} = require('../controllers/Farm.controller');
const { isAuth } = require('../middleware/isAuth');

const router = express.Router();

// create a new Farm
router.post('/create', isAuth,addFarm);
router.get('/all',isAuth,allFarm);
router.put('/book', isAuth,isBooked);
router.get('/booked', isAuth,allBookedFarm);

module.exports = router;
