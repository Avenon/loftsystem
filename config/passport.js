var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('users');

passport.serializeUser(function (user, done) {
  console.log('serializeUser: ', user);
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  console.log('deserializeUser: ', id);
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy({
  // можно переопределить поле username, если у нас, например уникально email usernameField: 'email'
}, (username, password, done) => {
  User.findOne({username: username}, (err, user) => {
    if (err) {
      return done(err); 
    }
    if (!user) {
      return done(null, false, {
        message: 'Некорректное имя пользователя'
      });
    }
    if (!user.validPassword(password)) {
      return done(null, false, {
        message: 'Некорректный пароль'
      });
    }
    return done(null, user);
  });
}
));
