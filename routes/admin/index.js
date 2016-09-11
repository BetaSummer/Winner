var express = require('express');
var router = express.Router();
module.exports = function(app) {
  var user = require('./user');
  var category = require('./category');
  var commodity = require('./commodity');
  var routes = [
    { path: '', router: user },
    { path: 'user', router: user },
    { path: 'category', router: category },
    { path: 'commodity', router: commodity }
  ];
  
  routes.forEach(function(route) {
    app.use('/admin/' + route.path, route.router);
  }); 
}