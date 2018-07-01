var express = require('express');
const fs = require('fs');
const path = require('path');
var router = express.Router();
var ctrlAuth = require('../controllers/authentication');
var ctrlNews = require('../controllers/news');

/*
router.get('*', (req, res, next) => {
  res.render = fs.readFileSync(path.resolve(path.join('public', 'index.html')));
});
*/

// регистрация
router.post('/api/saveNewUser', ctrlAuth.register);
// авторизация
router.post('/api/login', ctrlAuth.login);

router.put('/api/updateUser/:id', ctrlAuth.updateUser);

router.delete('/api/deleteUser/:id', ctrlAuth.deleteUser);

router.get('/api/getNews', ctrlNews.getNews);
router.get('/api/getOneNews/:id', ctrlNews.getOneNews);
router.post('/api/newNews', ctrlNews.newNews);
router.put('/api/updateNews/:id', ctrlNews.updateNews);
router.delete('/api/deleteNews/:id', ctrlNews.deleteNews);

router.post('/api/saveUserImage/:id', ctrlAuth.setImage);

module.exports = router;
