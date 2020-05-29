const express = require("express");
const router = express.Router();

const {
  createCommentLike,
  findUserCommentLikes,
  
  createPostLike,
  findUserPostLikes,
  
} = require("../controllers/like");

router.post("/comment", (req, res) => {
  createCommentLike(req, res);
});

router.get("/comment/user/:id", (req, res) => {
  findUserCommentLikes(req, res);
});



router.post("/post", (req, res) => {
  createPostLike(req, res);
});

router.get("/post/user/:id", (req, res) => {
  findUserPostLikes(req, res);
});



module.exports = router;
