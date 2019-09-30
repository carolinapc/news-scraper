let axios = require("axios");
let cheerio = require("cheerio");
let db = require("../models");

module.exports = function (app) {
  // A GET route for scraping the global news website
  app.get("/api/scrape", function (req, res) {
    
    axios.get("https://globalnews.ca").then(function(response) {

      var $ = cheerio.load(response.data);

      $(".tab-panel .story article").each(function(i, element) {

        var data = {};
        
        data.title = $(this).children(".story-h").children("a").text();
        data.url = $(this).children("a").attr("href");
        data.summary = $(this).children(".story-txt").children("p").text().split("Continue reading")[0];
        
        db.Article.create(data).then(function () {}).catch(function(){});
        
      });

      res.send("Scrape Complete");    
      
    });
    
  });

  //save an article
  app.post("/api/articles", function (req, res) {
    
    db.Article.findByIdAndUpdate(req.body.id, { saved: true }, function (err, result) {
      if (err) {
        console.log(err);
      }
      else {
        res.send("Article Saved");
      }
    });
  });

  //delete an article
  app.delete("/api/articles", function (req, res) {
    
    db.Article.findById(req.body.id, function (err, article) {
      db.Comment.deleteMany({
        _id: {
          $in: article.comments
        }
      }, function (err) {
        if (err) {
          console.log(err);
        }
        else {
          article.remove();
          res.send("Article Deleted");
        }    
      });
      
    });
  });
  
  //delete all articles
  app.delete("/api/articles/all", function (req, res) {
    db.Article.deleteMany({}, function (err, result) {
      if (err) {
        console.log(err);
      }
      else {
        db.Comment.deleteMany({}, function (err) {
          if (err) {
            console.log(err);
          }
          else {
            res.send("All Articles Deleted");    
          }
        });
      }
    });
  });

  // Create a new comment and associate it to Article
  app.post("/api/comment/:articleId", function(req, res) {
    db.Comment.create(req.body)
      .then(function (dbComment) {
        return db.Article.findOneAndUpdate(
          {_id: req.params.articleId},
          {
            $push: {
              comments: dbComment._id
            }
          },
          { new: true });
      })
      .then(function (dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        console.log(err);
        res.json(err);
      });
  });

  // Delete a comment
  app.delete("/api/comment/:id/:articleId", function (req, res) {
    
    db.Comment.findByIdAndDelete(req.params.id)
      .then(function () {
        return db.Article.findByIdAndUpdate(req.params.articleId, {
          $pull: {comments: req.params.id}
        });
      })
      .then(function () {
        res.json({});
      })
      .catch(function(err) {
        console.log(err);
        res.json(err);
      });
  });
  
};
