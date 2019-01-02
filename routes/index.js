var axios =          require('axios');
var express =        require('express');
var router =         express.Router();
var example =        require('../example.json');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'GitCreds', username: '', status: '', stats: {} });
});

router.post('/', function(req, res, next) {
  var baseURL =           'https://api.github.com/users/';
  var query =             '/repos?per_page=100';
  var data =              undefined;
  var nRepositories =     undefined;
  var nForked =           0;
  var nAuthored =         0;
  var fAuthoredPercent =  0.0;
  var stats =             {};
  axios.get(baseURL + req.body.username + query)
    .then(function (response) {
      data =               response.data;
      nRepositories =      Object.keys(data).length;
      for (key in data) {
        if (data[key].fork) nForked++;
      }
      nAuthored =          nRepositories - nForked;
      fAuthoredPercent =   Math.round((nAuthored / nRepositories) * 1000) / 10;
      stats = {
        nRepositories:     nRepositories,
        nAuthored:         nAuthored,
        nForked:           nForked,
        fAuthoredPercent:  fAuthoredPercent
      }
    })
    .catch(function (error) {
      console.log(error);
      res.render('index', { title: 'GitCreds', username: req.body.username, status: 'Failure', stats: stats });
      return;
    })
    .then(function () {
      res.render('index', { title: 'GitCreds', username: req.body.username, status: 'Success', stats: stats });
  });
});

module.exports = router;
