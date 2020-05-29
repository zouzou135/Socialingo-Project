import React, { useState } from "react";
import { Card, Row, Col, Image, Button, Spinner } from "react-bootstrap";
import defaultAvatar from "../../images/DefaultPP.png";
import { format } from "date-fns";

const Comment = ({
  comment,
  post,
  user,
  updateUserCommentLikes,
  incrementCommentLike,
}) => {
  const [isFetching, setIsfetching] = useState(false);
  const likeComment = async () => {
    setIsfetching(true);
    try {
      const userId = user.user.UserID;
      const postId = post.PostID;
      const commentId = comment.CommentID;
      const body = { userId, postId, commentId };
      const res = await fetch("http://localhost:3001/like/comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (res.status === 200) {
        updateUserCommentLikes(commentId);
        incrementCommentLike(commentId);
      }
    } catch (error) {
      console.error(error);
    }
    setIsfetching(false);
  };
  let avatar;
  if (comment.ProfilePicture) {
    const b64 = new Buffer(comment.ProfilePicture).toString("base64");
    avatar = "data:image/png;base64," + b64;
  }
  const isLiked = user.userCommentLikes.includes(comment.CommentID);
  // console.log("comment =", comment);
  return (
    <Card className="mt-2 p-3">
      <Row>
        <Col sm="3" className="border-right text-center">
          <p className="m-0 mb-2 text-secondary">{comment.Username}</p>
          <Image
            src={avatar || defaultAvatar}
            alt="avatar"
            roundedCircle
            style={{ maxWidth: "50px" }}
          />
          <p className="m-0 mt-2 text-secondary text-left">
            <small>
              <span style={{ fontWeight: "bold", textDecoration: "underline" }}>
                Fluent:
              </span>{" "}
              {comment.UserLngFluent} <br />
              <span style={{ fontWeight: "bold", textDecoration: "underline" }}>
                Learning:
              </span>{" "}
              {comment.UserLngLearn}
            </small>
          </p>
        </Col>
        <Col>
          <p className="text-secondary text-right">
            {format(new Date(comment.created_on), "MM/dd/yyyy HH:mm")}
          </p>
          <hr />
          <p>{comment.Comment}</p>
          <hr />
          <p>
            <strong>This is the right sentence</strong> <br />
            {comment.RightSentence}
          </p>
          <Button
            disabled={isLiked || isFetching}
            variant="danger"
            onClick={() => {
              likeComment();
            }}
            style={{ position: "absolute", bottom: "0", right: "1rem" }}
          >
            {isFetching && (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            )}
            Like {comment.LikeCount}
          </Button>
        </Col>
      </Row>
    </Card>
  );
};

export default Comment;
