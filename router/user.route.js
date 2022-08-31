const express = require('express');
const {isAuth} = require('../middleware/isAuth');


const {
  userSignup,
  userLogin,
  allfarm,
  getSinglefarmById,
  bookfarm,
  allBookedfarm,
  switchAdmin,
} = require('../controllers/user.controlller');

const router = express.Router();

// signup
router.post('/signup', userSignup);
// login
router.post('/login', userLogin);

// view all farm
router.get('/farms', allfarm);

// view single farm by id
router.get('/farm/:id',isAuth, getSinglefarmById);

// book a farm
router.put('/farm/book/:id',isAuth, bookfarm);

// get all booked farm
router.get('/booked', allBookedfarm);

// change to admin
router.put('/admin/:id', switchAdmin);

module.exports = router;
