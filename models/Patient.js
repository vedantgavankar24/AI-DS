const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  regid: { 
    type: String,
    unique: true, 
    required: true, 
    ref: 'Patient' 
  },
  name: String,
  age: Number,
  gender: String,
  bloodGroup: String,
  roomNumber: Number,
  floorNumber: Number,
  bedNumber: Number,
  diseases: String,
  dietStatus: String,
  allergies: String,
  contact: String,
  emergencyContact: String,
  morningMeal: { 
    items: { type: String, },
    instructions: { type: String, default: '' },
  },
  afternoonMeal: { 
    items: { type: String, },
    instructions: { type: String, default: '' },
  },
  eveningMeal: { 
    items: { type: String, },
    instructions: { type: String, default: '' },
  },
});

module.exports = mongoose.model('Patient', PatientSchema);
