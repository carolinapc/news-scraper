let axios = require("axios");
let cheerio = require("cheerio");
let db = require("../models");

module.exports = function (app) {
  // A GET route for scraping the echoJS website
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

  app.delete("/api/articles", function (req, res) {
    
    db.Article.findByIdAndDelete(req.body.id, function (err, result) {
      if (err) {
        console.log(err);
      }
      else {
        res.send("Article Deleted");
      }
    });
  });

  app.delete("/api/articles/all", function (req, res) {
    console.log(1);
    db.Article.deleteMany({}, function (err, result) {
      if (err) {
        console.log(err);
      }
      else {
        res.send("All Articles Deleted");
      }
    });
  });

  // Route for getting all Articles from the db
  app.get("/articles", function(req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
      .then(function(dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  // Route for grabbing a specific Article by id, populate it with it's note
  app.get("/articles/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({ _id: req.params.id })
      // ..and populate all of the notes associated with it
      .populate("note")
      .then(function(dbArticle) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  // Route for saving/updating an Article's associated Note
  app.post("/articles/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
      .then(function(dbNote) {
        // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
        // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      })
      .then(function(dbArticle) {
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  
};
