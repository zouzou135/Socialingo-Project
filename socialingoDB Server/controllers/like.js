const con = require("../DBConfig");

const createCommentLike = (req, res) => {
  const { userId, postId, commentId } = req.body;
  console.log(req.body);
  if (!userId || !postId || !commentId)
    return res.status(403).send("all field are mandatory");
  const sql = `SELECT * FROM LikesComment WHERE UserID = ${userId} AND PostID = ${postId} AND CommentID = ${commentId}`;
  con.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("internal server error");
    }
    if (result.length > 0) {
      return res.status(403).send("already liked by the user");
    }
    const sql = `UPDATE Comments SET LikeCount = LikeCount + 1   WHERE CommentID = ${commentId}`;
    con.query(sql, (err, result) =>{
      if(err){
        console.error(err)
        return res.status(500).send('internal server error')
      }
      const sql = `INSERT INTO LikesComment (UserID, PostID, CommentID) VALUES (${userId}, ${postId}, ${commentId})`;
      con.query(sql, (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).send("internal server error");
        }
        res.status(200).json(result);
      });
    })
    
  });
};

const findUserCommentLikes = (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(403).send("no user id");
  const sql = `SELECT * FROM LikesComment WHERE UserID = ${id}`;
  con.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("internal server error");
    }
    res.status(200).json(result);
  });
};

// const incrementCommentLike = (req, res) =>{
//   const {id} = req.params
//   if(!id) return res.status(403).send('no comment id')
//   const sql = `UPDATE Comments SET LikeCount = LikeCount + 1   WHERE CommentID = ${id}`;
//   con.query(sql, (err, result) =>{
//     if(err){
//       console.error(err)
//       return res.status(500).send('internal server error')
//     }
//     res.status(200).json(result);
//   })
// }

const createPostLike = (req, res) => {
  const { userId, postId  } = req.body;
  console.log(req.body);
  if (!userId || !postId  )
    return res.status(403).send("all field are mandatory");
  const sql = `SELECT * FROM LikesPost WHERE UserID = ${userId} AND PostID = ${postId}`;
  con.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("internal server error");
    }
    if (result.length > 0) {
      return res.status(403).send("already liked by the user");
    }
    const sql = `UPDATE Post SET LikeCount = LikeCount + 1   WHERE PostID = ${postId}`;
    con.query(sql, (err, result) =>{
      if(err){
        console.error(err)
        return res.status(500).send('internal server error')
      }
      const sql = `INSERT INTO LikesPost (UserID, PostID) VALUES (${userId}, ${postId})`;
      con.query(sql, (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).send("internal server error");
        }
        res.status(200).json(result);
      });
    })
    
  });
};
const findUserPostLikes = (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(403).send("no user id");
  const sql = `SELECT * FROM LikesPost WHERE UserID = ${id}`;
  con.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("internal server error");
    }
    res.status(200).json(result);
  });
};

module.exports = { createCommentLike, createPostLike, findUserCommentLikes, findUserPostLikes };
