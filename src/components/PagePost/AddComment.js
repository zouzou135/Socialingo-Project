import React, { useState } from "react";
import { Card, Form, Button } from "react-bootstrap";

const AddComment = ({ post, user, setOpenAddComment, updateComments }) => {
  const [rightSentence, setRightSentence] = useState("");
  const [comment, setComment] = useState("");
  return (
    <Card className='p-4 mt-4' >
      <Form
        onSubmit={async (e) => {
          e.preventDefault();
          const userId = user && user.user.UserID;
          const postId = post && post.PostID;
          const userLngFluent = user && user.knownLang.map(el => el.LanguageName).join(', ')
          const userLngLearn = user && user.langToLearn.map(el => el.LanguageName).join(', ')
          console.log(userId, postId, rightSentence, comment)
          if (!rightSentence || !comment || !userId || !postId) return;
          const body = { userId, postId, rightSentence, comment, userLngFluent, userLngLearn };
          try {
            const res = await fetch("http://localhost:3001/comment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(body),
            });
            console.log(res.status);
            if (res.status === 200) {
              const json = await res.json()
              const newComment = {
                CommentID: json.insertId,
                Comment: comment,
                RightSentence: rightSentence,
                UserID: user.user.UserID,
                Username: user.user.Username,
                ProfilePicture: user.user.ProfilePicture,
                created_on: Date.now(),
                LikeCount: 0,
                UserLngFluent: userLngFluent,
                UserLngLearn: userLngLearn
              }
              console.log('json =', json)
              setRightSentence("");
              setComment("");
              setOpenAddComment(false);
              updateComments(newComment)
            }
          } catch (error) {
            console.error(error);
          }
        }}
      >
        <Form.Group>
          <Form.Label>Rewrite the correct sentence here</Form.Label>
          <Form.Control
            as="textarea"
            rows="2"
            required
            value={rightSentence}
            onChange={(e) => {
              setRightSentence(e.target.value);
            }}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Comment on the post</Form.Label>
          <Form.Control
            as="textarea"
            rows="2"
            required
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
            }}
          />
        </Form.Group>
        <Button style={{ marginRight: "10px" }} variant="primary" type="submit">
          Submit
        </Button>
        <Button variant="secondary" onClick={() => {
          setRightSentence('')
          setComment('')
          setOpenAddComment(false)
        }} >Cancel</Button>
      </Form>
    </Card>
  );
};

export default AddComment;
