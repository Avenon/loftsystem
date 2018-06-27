var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('users');

var sendJSONresponse = (res, status, content) => {
  res.status(status);
  res.json(content);
};

module.exports.register = (req, res) => {
  if (!req.body.username || !req.body.password || !req.body.firstName || !req.body.surName || !req.body.middleName) {
    sendJSONresponse(res, 400, {
      'message': 'Все поля обязательны'
    });
    return;
  }

  var user = new User();

  user.username = req.body.username;
  user.firstName = req.body.firstName;
  user.surName = req.body.surName;
  user.middleName = req.body.middleName;

  user.setPassword(req.body.password);

  user.save((err) => {
    var token;
    if (err) {
      sendJSONresponse(res, 404, err);
    } else {
      token = user.generateJwt();
      sendJSONresponse(res, 200, {
        'token': token
      });
    }
  });
};

module.exports.login = (req, res) => {
  if (!req.body.username || !req.body.password) {
    sendJSONresponse(res, 400, {
      'message': 'Все поля обязательны'
    });
    return;
  }

  passport.authenticate('local', (err, user, info) => {
    var token;
    if (err) {
      sendJSONresponse(res, 404, err);
      return;
    }

    if (user) {
      token = user.generateJwt();
      sendJSONresponse(res, 200, {
        'token': token
      });
    } else {
      sendJSONresponse(res, 401, info);
    }
  })(req, res);
};
