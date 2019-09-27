let axios = require("axios");
let cheerio = require("cheerio");
let db = require("../models");

module.exports = function (app) {
  //index
  app.get("/", function (req, res) {
    db.Article.find({})
      .then(function(dbArticle) {
        res.render("index",dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
    
  });

  //saved
  app.get("/", function (req, res) {
    res.render("saved");
  });

  //redirect to index
  app.get("*", function (req, res) {
    res.redirect("/");
  });
};
