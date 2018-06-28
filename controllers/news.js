var mongoose = require('mongoose');
var News = mongoose.model('news');

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

module.exports.newNews = (req, res) => {
  News.create({
    newsauthor: req.body.newsauthor,
    newsdate: req.body.newsdate,
    newstheme: req.body.newstheme,
    newstext: req.body.newstext
  }, function(err, news) {
    if (err) {
      sendJsonResponse(res, 400, err);
    } else {
      sendJsonResponse(res, 201, news);
    }
  });
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
        news.newsdate = req.body.newsdate;
        news.newstheme = req.body.newstheme;
        news.newstext = req.body.newstext;
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
