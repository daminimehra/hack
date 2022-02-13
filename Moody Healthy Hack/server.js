const express = require("express");
const app = express();
const PORT = process.env.PORT || 8000;
const path = require("path");
const fs = require("fs");

const { dirname } = require("path");

app.use(express.static("views"));
app.use(express.static("jsons"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/getQuestions", (req, res) => {
  var Qfile = fs.readFileSync(__dirname + "/jsons/questions.json");
  var questionList = JSON.parse(Qfile);
  res.json(questionList);
});

app.get("/getResult", (req, res) => {
  var result = req.query.result;
  var email = req.query.email;
  var date = new Date();
  var uData = fs.readFileSync(__dirname + "/jsons/data.json");
  var userData = JSON.parse(uData);
  var user = {
    userEmail: email,
    userResult: result,
    userData:
      date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear(),
  };
  userData.users[userData.users.length] = user;
  fs.writeFile(
    __dirname + "/jsons/data.json",
    JSON.stringify(userData),
    (err) => {
      if (err) {
        throw err;
      }
    }
  );
  var total = parseInt(result);
  if (total > 16) {
    res.json({ color: "Red" });
  } else if (total > 8) {
    res.json({ color: "Yellow" });
  } else {
    res.json({ color: "Green" });
  }
});

app.get("/setComment", (req, res) => {
  var CommentName = req.query.CommentName;
  var CommentEmail = req.query.CommentEmail;
  var CommentFeel = req.query.CommentFeel;
  var Comment = req.query.Comment;
  var comments = fs.readFileSync(__dirname + "/jsons/comment.json");
  var comments = JSON.parse(comments);
  var newComment = {
    Name: CommentName,
    Email: CommentEmail,
    Feel: CommentFeel,
    CommentRecieved: Comment,
  };
  comments.data[comments.data.length] = newComment;
  fs.writeFile(
    __dirname + "/jsons/comment.json",
    JSON.stringify(comments),
    (err) => {
      if (err) return res.json({ success: "false" });
      else return res.json({ success: "true" });
    }
  );
});

app.get("/getCount", (req, res) => {
  var data = fs.readFileSync(__dirname + "/jsons/data.json");
  data = JSON.parse(data);
  var red = 0,
    yellow = 0,
    green = 0;
  for (i = 0; i < data.users.length; i++) {
    if (data.users[i].userResult > 16) {
      red++;
    } else if (data.users[i].userResult > 8) {
      yellow++;
    } else {
      green++;
    }
  }
  var response = {
    one: red + yellow + green,
    two: green,
    three: yellow,
    four: red,
  };
  res.json({ response: response });
});

app.listen(PORT, () => {
  console.log("http://localhost:" + PORT);
});
