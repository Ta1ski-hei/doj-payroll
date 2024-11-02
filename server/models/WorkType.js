const mongoose = require('mongoose');

const workTypeSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: [
      'ADMINISTRATIVE',
      'PROSECUTION',
      'COURT',
      'COURT_HEARING',
      'PUBLIC_DEFENDER',
      'MEDIA',
      'STATE_BAR',
      'RECRUITMENT'
    ]
  },
  type: {
    type: String,
    required: true
  },
  minPay: {
    type: Number,
    required: true
  },
  maxPay: {
    type: Number,
    required: true
  },
  // Klíčová slova pro rozpoznání typu práce ze zprávy
  keywords: [{
    type: String
  }]
});

module.exports = mongoose.model('WorkType', workTypeSchema); 