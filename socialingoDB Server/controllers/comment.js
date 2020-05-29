const con = require("../DBConfig");

const createComment = (req, res) => {
  console.log(req.body);
  const { userId, postId, rightSentence, comment, userLngFluent, userLngLearn } = req.body;
  if (!postId || !rightSentence || !userId || !comment)
    return res.status(403).send("all fields are required");
  const sql = `INSERT INTO Comments (UserID, PostID, RightSentence, Comment, UserLngFluent, UserLngLearn) 
               VALUES (${userId}, ${postId}, "${rightSentence}", "${comment}", "${userLngFluent || null}", "${userLngLearn || null}")`;
  
  console.log(sql)
  con.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("internal server error");
    }
    res.status(200).json(result);
  });
};

const findCommentsByPostId = (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(404).send("no post id");
  const sql = `SELECT * FROM Comments WHERE PostID = ${id}`;
  con.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("internal server error");
    }
    if (result.length < 1) return res.status(404).send("not found");
    res.status(200).json(result);
  });
};

module.exports = { findCommentsByPostId, createComment };
