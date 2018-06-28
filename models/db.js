const mongoose = require('mongoose');
var dbURI = 'mongodb://localhost:27017/loftsystem';
mongoose.connect(dbURI);

require('./users');
require('./news');
