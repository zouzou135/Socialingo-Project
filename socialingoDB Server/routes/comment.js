const express = require("express");
const router = express.Router();

const {
  createComment,
  findCommentsByPostId,
} = require("../controllers/comment");

router.get("/post/:id", (req, res) => {
  findCommentsByPostId(req, res);
});

router.post("/", (req, res) => {
  createComment(req, res);
});

module.exports = router;
