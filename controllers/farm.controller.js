const Farm = require('../models/farm.model');
const User = require('../models/user.model');

exports.addFarm = async (req, res) => {
  const id = req.user._id;

  // check if user exist in database
  const user = await User.findOne({ userId: id });

  // Authorization
  if (user.role !== 'admin') {
    return res
      .status(401)
      .json({ message: 'You are not authorized to add a Farm Product' });
  }
  const {
    userId,
    farmDivision,
    categories,
    isBooked,
  } = req.body;
  try {
    const farm = await Farm.create({
        userId: id,
        farmDivision,
        categories,
        isBooked,
    });

    return res.status(201).json(farm);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

exports.allFarm= async (req, res) => {
    try {
      const q = req.query.name;
  
      //destructured req.query
      const { page, limit } = req.query; // const page = req.query.page or const limit = req.query.limit
      const farm = await Farm.find()
        .sort({ createdAt: 1 })
        .skip((page - 1) * limit) // 0 * 5 // skip 0
        .limit(limit * 1);
      return res.status(200).json({ count: farm.length, data: farm });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message });
    }
  };
  
  exports.isBooked = async (req, res) => {
    try {
      const id = req.user._id;
      const book = await Farm.findOneAndUpdate(
        { userId: id },
        {
          isBooked: true,
        },
        { new: true });
      {
      return res.status(200).json(book);
      }} 
    catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message });
    }
  }
  
  exports.allBookedFarm = async (req, res) => {
    try {
      const id = req.user._id;
      const user = await User.findOne({ _id: id });
      
  
      if (user.role !== 'admin') {
        return res.status(401).json({ message: 'Unauthorized' });
      }
  
      const booked_farm = await Farm.find({ isBooked: true });
      return res.status(200).json(booked_farm);
    } catch (error) {
      console.log(error);
    }
  };