const mongoose = require('mongoose');

var newsSchema = new mongoose.Schema({
  newsauthor: {
    type: String,
    required: true
  },

  date: {
    type: Date,
    required: true
  },

  theme: {
    type: String,
    required: true
  },

  text: {
    type: String,
    required: true
  },

  edited: {
    type: Date,
    default: Date.now,
    required: true
  }

});

mongoose.model('news', newsSchema);
