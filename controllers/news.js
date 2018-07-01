var mongoose = require('mongoose');
var News = mongoose.model('news');
var User = mongoose.model('users');

var sendJsonResponse = (res, status, content) => {
  res.status(status);
  res.json(content);
};

module.exports.getNews = (req, res) => {

  News
    .find()
    .exec((err, news) => {
      if (err) {
        sendJsonResponse(res, 404, err);
        return;
      }

      sendJsonResponse(res, 200, news);
    });
};

module.exports.getOneNews = (req, res) => {
  if (req.params && req.params.id) {
    News
      .findById(req.params.id)
      .exec((err, news) => {
        if (!news) {
          sendJsonResponse(res, 404, {
            'message': 'News id not found'
          });
          return;
        } else if (err) {
          sendJsonResponse(res, 404, err);
          return;
        }

        sendJsonResponse(res, 200, news);
      });
  } else {
    sendJsonResponse(res, 404, {
      'message': 'No news id in request'
    });
  }
};
/*
0: {id: "", text: "", theme: "", date: "", user: {…}}1: {id: "", text: "", theme: "", date: "", user: {…}}length: 2__proto__: Array(0)
*/
module.exports.newNews = (req, res) => {

    News.create({
      newsauthor: req.body.newsauthor,
      date: req.body.date,
      theme: req.body.theme,
      text: req.body.text
    }, function(err, news) {
      if (err) {
        sendJsonResponse(res, 400, err);
      } else {
        sendJsonResponse(res, 201, news);
      }
    });
  //{"text":"masmasmdasfd","theme":"uar","date":"2018-06-29 20:15:45+03:00"}
  
};

module.exports.updateNews = (req, res) => {

  if (!req.params.id) {
    sendJsonResponse(res, 404, {
      'message': 'Not found, news id is required'
    });
    return;
  }

  News
    .findById(req.params.id)
    .exec(
      function(err, news) {
        if (!news) {
          sendJsonResponse(res, 404, {
            'message': 'News not found'
          });
          return;
        } else if (err) {
          sendJsonResponse(res, 400, err);
          return;
        }

        news.newsauthor = req.body.newsauthor;
        news.date = req.body.date;
        news.theme = req.body.theme;
        news.text = req.body.text;
        news.save(function (err, news) {
          if (err) {
            sendJsonResponse(res, 404, err);
          } else {
            sendJsonResponse(res, 200, news);
          }
        });
      }
    );
};

module.exports.deleteNews = (req, res) => {
  var newsid = req.params.id;
  if (newsid) {
    News
      .findByIdAndRemove(newsid)
      .exec(
        function (err, news) {
          if (err) {
            sendJsonResponse(res, 404, err);
            return;
          }
          sendJsonResponse(res, 204, null);
        }
      );
  } else {
    sendJsonResponse(res, 404, {
      'message': 'No news id'
    });
  }
};
