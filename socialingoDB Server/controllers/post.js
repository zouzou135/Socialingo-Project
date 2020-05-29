const con = require("../DBConfig");

const createPost = (req, res) => {
  const { languageId, text, userId, userLngFluent, userLngLearn } = req.body;
  if (!languageId || !text || !userId)
    return res.status(403).send("all fields are required");
  const sql = `INSERT INTO Post (PUserID, PLangID, PostText, UserLngFluent, UserLngLearn) 
               VALUES (${userId}, ${languageId}, "${text}", "${userLngFluent || null}", "${userLngLearn || null}")`;
  con.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("internal server error");
    }
    res.status(200).json(result);
  });
};
// select Post.PostID, count(Comments.CommentID) as nbcomment from Comments left join Post on Post.PostID = Comments.PostID where Post.PostID = 6  group by Post.PostID;

const findUserPosts = (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(404).send("no user id");
  const sql = `SELECT Post.PostID, PostText, Post.created_on, Post.LikeCount,
               Post.UserLngFluent, Post.UserLngLearn, LanguageName,
               count(Comments.CommentID) as nbComment 
               FROM Comments 
               right join Post on Post.PostID = Comments.PostID
               inner join Language on PLangID = LanguageID 
               WHERE PUserID = ${id}
               group by Post.PostID`;
  con.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("internal server error");
    }
    res.status(200).json(result);
  });
};

const findPosts = (req, res) => {
  const sql = `SELECT PostID, PostText, created_on, LikeCount, Post.PUserID, Username, ProfilePicture,
               UserLngFluent, UserLngLearn, LanguageName 
               FROM Post 
               inner join User on  Post.PUserID = User.UserID 
               inner join Language on PLangID = LanguageID `;
  con.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("internal server error");
    }
    res.status(200).json(result);
  });
};

const findPostById = (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(404).send("no post id");
  const sql = `SELECT PostID, PostText, created_on, Post.PUserID, Username, ProfilePicture, LanguageName,
               UserLngFluent, UserLngLearn, LikeCount  
               FROM Post 
               inner join User on  Post.PUserID = User.UserID 
               inner join Language on PLangID = LanguageID 
               WHERE PostID = ${id}`;

  con.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("internal server error");
    }
    if (result.length < 1) return res.status(404).send("not found");
    const post = result[0];
    const sql2 = `select CommentID, RightSentence, Comment, created_on, 
                  LikeCount, Comments.UserID, Username, ProfilePicture,
                  UserLngFluent, UserLngLearn 
                  from Comments  
                  inner join User on  Comments.UserID = User.UserID 
                  where Comments.PostID = ${post.PostID}`;

    con.query(sql2, (err, comments) => {
      if (err) {
        console.error(err);
        return res.status(500).send("internal server error");
      }
      res.status(200).json({ post, comments });
    });
  });
};

const findPostsByLangs = (req, res) => {
  console.log(req.body)
  const langs = req.body
  console.log('langs =', langs.join(', '))
  const sql = `SELECT PostID, PostText, created_on, LikeCount, Post.PUserID, Username, ProfilePicture,
               UserLngFluent, UserLngLearn, LanguageName 
               FROM Post 
               inner join User on  Post.PUserID = User.UserID 
               inner join Language on PLangID = LanguageID 
               where PLangID in (${langs.join(', ')})`

  con.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("internal server error");
    }
    res.status(200).json(result);
  })

}

module.exports = { createPost, findUserPosts, findPosts, findPostById, findPostsByLangs };
