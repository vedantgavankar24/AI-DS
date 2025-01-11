const mongoose = require('mongoose');

const DeliverySchema = new mongoose.Schema({
  regid: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  dietChartId: { type: mongoose.Schema.Types.ObjectId, ref: 'DietChart', required: true },
  prepPersonId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  deliveryPersonId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mealboxid: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mealType: { type: String, enum: ['Morning', 'Afternoon', 'Evening'], required: true },
  prepTime: { type: Date },
  deliveryTime: { type: Date },
  prepstatus: { type: String, enum: ['Pending', 'In Progress', 'Delivered'], default: 'Pending' },
  deliverystatus: { type: String, enum: ['Pending', 'In Progress', 'Delivered'], default: 'Pending' },
  notes: { type: String, default: '' },
});

module.exports = mongoose.model('Delivery', DeliverySchema);
