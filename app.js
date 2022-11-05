const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true });

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
  },
});

const Article = mongoose.model("Article", articleSchema);

app.get("/articles", function (req, res) {
  Article.find({}, function (err, foundArticles) {
    if (!err) {
      res.send(foundArticles);
    }
    res.send(err);
  });
});
app.post("/articles", function (req, res) {
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content,
  });

  newArticle.save(function (err) {
    if (!err) {
      res.send(`Successfully added ${req.body.title}`);
    } else {
      res.send(err);
    }
  });
});

app.delete("/articles", function (req, res) {
  Article.deleteMany(function (err) {
    if (!err) {
      res.send("Oh my... all articles were deleted, success!");
    } else {
      res.send(err);
    }
  });
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
