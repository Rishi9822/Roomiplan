const mongoose = require('mongoose');

const layoutSchema = new mongoose.Schema({
  plotLength: Number,
  plotWidth: Number,
  rooms: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Layout', layoutSchema);
