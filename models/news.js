const mongoose = require('mongoose');

var newsSchema = new mongoose.Schema({
  newsauthor: {
    type: String,
    required: true
  },

  newsdate: {
    type: Date,
    required: true
  },

  newstheme: {
    type: String,
    required: true
  },

  newstext: {
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
