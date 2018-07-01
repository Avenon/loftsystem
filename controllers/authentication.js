var passport = require('passport');
var mongoose = require('mongoose');
var formidable = require('formidable');
var path = require('path');
var fs = require('fs');
var User = mongoose.model('users');

var sendJSONresponse = (res, status, content) => {
  res.status(status);
  res.json(content);
};

module.exports.register = (req, res) => {
  var json = req.body;
  var obj = JSON.parse(json);

  if (!obj.username || !obj.password || !obj.firstName || !obj.surName || !obj.middleName) {
    sendJSONresponse(res, 400, {
      'message': 'Все поля обязательны'
    });
    return;
  }

  var user = new User();

  user.username = obj.username;
  user.firstName = obj.firstName;
  user.surName = obj.surName;
  user.middleName = obj.middleName;

  user.setPassword(obj.password);

  user.save((err) => {
    var token;
    
    if (err) {
      sendJSONresponse(res, 404, err);
    } else {
      token = user.generateJwt();
      sendJSONresponse(res, 200, {
        'access_token': token,
        /* если что отправим на фронт не в токене */
        'username': user.username,
        'firstName': user.firstName,
        'surName': user.surName,
        'middleName': user.middleName,
        'img': '',
        'permission': {"chat":{"C":false,"R":true,"U":true,"D":false},
        'news': {"C":true,"R":true,"U":true,"D":true},
        'setting': {"C":false,"R":false,"U":false,"D":false}}
      });
    }
  });
};

module.exports.login = (req, res) => {
  var json = req.body;
  var obj = JSON.parse(json);

  // User.findOne({ username: req.body.username }, function(err, user) {
  if (!obj.username || !obj.password) {
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
    
    User.findOne({ username: obj.username }, function (err, user) {
      if (err) {
        sendJSONresponse(res, 400, err);
        return;
      }

      if (user) {
        token = user.generateJwt();
        sendJSONresponse(res, 200, {
          'access_token': token,
          'username': user.username,
          'firstName': user.firstName,
          'surName': user.surName,
          'middleName': user.middleName,
          'img': '',
          'permission': {"chat":{"C":false,"R":true,"U":true,"D":false},
          'news': {"C":true,"R":true,"U":true,"D":true},
          'setting': {"C":false,"R":false,"U":false,"D":false}}
        });
      } else {
        sendJSONresponse(res, 401, info);
      }
    });
  })(req, res);
};

module.exports.updateUser = (req, res) => {
  console.log(req.payload);
  
  var json = req.body;
  var obj = JSON.parse(json);

  console.log(req.body.surName);
  console.log(req.params.id);
  console.log(obj.surName);

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

        user.firstName = obj.firstName;
        user.surName = obj.surName;
        user.middleName = obj.middleName;

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

module.exports.setImage = (req, res) => {

  let form = new formidable.IncomingForm();
  // /home/avenon/projects/javascript/loftschool/lesson_03/homework_express/app_server/public/upload
  // let upload = path.join(__dirname, '../public', 'upload');
  let upload = path.join(__dirname, '../public', 'assets', 'imgusers');

  let fileName;

  if (!fs.existsSync(upload)) {
    fs.mkdirSync(upload);
  }

  form.uploadDir = upload;

  form.parse(req, function (err, fields, files) {
    console.log(files);

    if (err) {
      return next(err);
    }

    fileName = path.join(upload, files.image.name);
    fs.rename(files.image.path, fileName, function (err) {
      if (err) {
        console.error(err);
        fs.unlink(fileName);
        fs.rename(files.image.path, fileName);
      }

      let photoPath = './assets/imgusers/' + files.image.name;

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

            user.image = photoPath;

            user.save(function (err, user) {
              if (err) {
                sendJSONresponse(res, 404, err);
              } else {
                sendJSONresponse(res, 200, {
                  'path': user.image
                });
              }
            });
          }
        );
      res.redirect('/?msg=Картинка успешно загружена');
    });
  });
};
