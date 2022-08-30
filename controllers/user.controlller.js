const User = require('../models/user.model');
const Farm = require('../models/farm.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



exports.userSignup = async (req, res) => {
    const { password, email, name } = req.body;
    try {
      //  hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
      });
      return res.status(201).json({ message: 'User created successfully', userId: user._id });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message, message: 'internal server error' });
  }
};

exports.userLogin = async (req, res) => {
    const { password, email } = req.body;
    try {
      // validation
      if (!(password && email)) {
        return res.status(400).json({ message: 'Please fill all fields' });
      }
  
      // check if user exist in database
      const checkUser = await User.findOne({ email: email });
  
      // if user doesn't exist throw error
      if (!checkUser) {
        return res.status(404).json({ message: 'user not found' });
      }
  
      // if user exist in database, check if user password is correct
      const checkPassword = await bcrypt.compare(password, checkUser.password);
  
      // if user password is not correct throw error ==> invalid credentials
      if (!checkPassword) {
        return res.status(400).json({ message: 'invalid credentials' });
      }
  
      // if user password is correct tokenize the payload
      const payload = {
        _id: checkUser._id,
      };
  
      const token = await jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: '2d',
      });
  
      // store token in cookie ====> web browser local storage
      res.cookie('access-token', token);
      return res
        .status(202)
        .json({ message: 'User logged in successfully', token: token });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ error: error.message, message: 'internal server error' });
    }
  };
  // view all farm by user

exports.allfarm = async (req, res) => {
    try {
      const allfarms = await Farm.find();
      const dataInfo = {
        count: `${Farm.length} farm available`,
        allfarms,
      };
      return res.status(200).json(dataInfo);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ error: error.message, message: 'internal server error' });
    }
  };
  
  exports.getSinglefarmById = async (req, res) => {
    try {
      const id = req.params.id;
      const farm = await Farm.find({ userId: id }).populate('id');
      const dataInfo = {
        count: farm.length,
        farm,
      };
      return res.status(200).json(dataInfo);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ error: error.message, message: 'internal server error' });
    }
  };
  
  exports.bookfarm = async (req, res) => {
    try {
      const id = req.params.id;
      const user = await User.findById({_id:id});
      if (!user) {
        throw new Error('user does not exist'); // assignment read about throw new Error
      }
      const bookfarm = await Farm.findOneAndUpdate(
        {
          userId: id,
        },
        {
          isBooked: true,
        },
        {
          new: true,
        }
      );
  
      return res.status(200).json(bookfarm);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ error: error.message, message: 'internal server error' });
    }
  };
  
  exports.allBookedfarm = async (req, res) => {
    try {
      const booked_farm = await Farm.find({ isBooked: true }); // query
      const dataInfo = {
        count: booked_farm.length,
        booked_farm,
      };
      return res.status(200).json(dataInfo);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ error: error.message.kind, message: 'internal server error' });
    }
  };
  
  exports.switchAdmin = async (req, res) => {
    try {
      const id = req.params.id;
      const user = await User.findOneAndUpdate(
        id,
        {
          role: 'admin',
        },
        { new: true }
      );
      return res.status(200).json(user);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ error: error.message.kind, message: 'internal server error' });
    }
  };