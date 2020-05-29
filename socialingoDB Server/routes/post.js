const express = require("express");
const router = express.Router();

const {
  createPost,
  findUserPosts,
  findPosts,
  findPostById,
  findPostsByLangs,
} = require("../controllers/post");

router.get("/", (req, res) => {
  findPosts(req, res);
});

router.get("/:id", (req, res) => {
  findPostById(req, res);
});

router.get("/user/:id", (req, res) => {
  findUserPosts(req, res);
});

router.post("/user", (req, res) => {
  createPost(req, res);
});

router.post("/lang", (req, res) => {
  console.log('lang route')
  findPostsByLangs(req, res);
});

module.exports = router;
