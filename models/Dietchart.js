const mongoose = require('mongoose');

const DietChartSchema = new mongoose.Schema({
  regid: { type: String, ref: 'Patient', required: true },
  morningMeal: { 
    items: { type: String, required: true },
    instructions: { type: String, default: '' },
  },
  afternoonMeal: { 
    items: { type: String, required: true },
    instructions: { type: String, default: '' },
  },
  eveningMeal: { 
    items: { type: String, required: true },
    instructions: { type: String, default: '' },
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('DietChart', DietChartSchema);
