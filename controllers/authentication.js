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
        /* если что отправим на фронт не в токене
        'username': user.username,
        'firstName': user.firstName,
        'surName': user.surName,
        'middleName': user.middleName
        */
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

module.exports.updateUser = (req, res) => {
  if (!req.params.id) {
    sendJSONresponse(res, 404, {
      'message': 'Not found, user id is required'
    });
    return;
  }

  User
    .findById(req.params.id)
    .exec(
      function(err, user) {
        if (!user) {
          sendJSONresponse(res, 404, {
            'message': 'User not found'
          });
          return;
        } else if (err) {
          sendJSONresponse(res, 400, err);
          return;
        }

        user.firstName = req.body.firstName;
        user.surName = req.body.surName;
        user.middleName = req.body.middleName;

        user.save(function (err, user) {
          if (err) {
            sendJSONresponse(res, 404, err);
          } else {
            sendJSONresponse(res, 200, user);
          }
        });
      }
    );
};

module.exports.deleteUser = (req, res) => {
  var userid = req.params.id;
  if (userid) {
    User
      .findByIdAndRemove(userid)
      .exec(
        function (err, user) {
          if (err) {
            sendJSONresponse(res, 404, err);
            return;
          }
          sendJSONresponse(res, 204, null);
        }
      );
  } else {
    sendJSONresponse(res, 404, {
      'message': 'No user id'
    });
  }
};
