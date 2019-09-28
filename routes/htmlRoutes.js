let axios = require("axios");
let cheerio = require("cheerio");
let db = require("../models");

module.exports = function (app) {
  //index
  app.get("/", function (req, res) {
    db.Article.find({saved: false})
      .then(function (articles) {
        res.render("index", { articles: articles });
      })
      .catch(function(err) {
        res.json(err);
      });
    
  });

  //saved
  app.get("/saved", function (req, res) {
    db.Article.find({saved: true})
      .then(function(articles) {
        res.render("saved",{articles: articles});
      })
      .catch(function(err) {
        res.json(err);
      });
    
  });

  
};
