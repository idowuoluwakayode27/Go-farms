const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema(
  {

    userId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    farmDivision: {
      type: String,
      enum: ['Trainings', 'House Consultation', 'Health products','Feed Analysis & research', 'Livestock'],
    },
    categories: {
        type: String,
        enum: ['Fishery', 'Poultry', 'Piggery','Crops'],
      },
    isBooked: {
        type: Boolean,
        default: false,
      },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Farm', farmSchema);
