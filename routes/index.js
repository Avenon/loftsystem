var express = require('express');
const fs = require('fs');
const path = require('path');
var router = express.Router();
var ctrlAuth = require('../controllers/authentication');

/*
router.get('*', (req, res, next) => {
  res.render = fs.readFileSync(path.resolve(path.join('public', 'index.html')));
});
*/
/*
router.post('/api/saveNewUser', (req, res, next) => {
  ctrlUsers.saveNewUser(req, res);
});
*/

// регистрация
router.post('/api/saveNewUser', ctrlAuth.register);
router.post('/api/login', ctrlAuth.login);

module.exports = router;
