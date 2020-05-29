import React, { useState } from "react";
import { format } from "date-fns";
import { Card, Row, Col, Image, Button, Spinner } from "react-bootstrap";
import defaultAvatar from "../../images/DefaultPP.png";

const Post = ({ post, setOpenAddComment, user, incrementPostLike, updateUserPostLikes }) => {
  const [isFetching, setIsFetching] = useState(false)
  const likeComment = async () => {
    setIsFetching(true)
    try {
      const userId = user.user.UserID;
      const postId = post.PostID;

      const body = { userId, postId };
      const res = await fetch("http://localhost:3001/like/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      console.log('status =', res.status)
      if (res.status === 200) {
        updateUserPostLikes(postId);
        incrementPostLike();
      }
    } catch (error) {
      console.error(error);
    }
    setIsFetching(false)
  };
  let avatar;
  if (post.ProfilePicture) {
    const b64 = new Buffer(post.ProfilePicture).toString("base64");
    avatar = "data:image/png;base64," + b64;
  }
  console.log("post =", post);
  console.log('user =', user)
  const isLiked = user.userPostLikes.includes(post.PostID);
  return (
    <Card className="p-3">
      <Row>
        <Col sm="3" className="border-right text-center">
          <p className="m-0 mb-2 text-secondary">{post.Username}</p>
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
              {post.UserLngFluent} <br />
              <span style={{ fontWeight: "bold", textDecoration: "underline" }}>
                Learning:
              </span>{" "}
              {post.UserLngLearn}
            </small>
          </p>
        </Col>
        <Col>
          <Row className="text-secondary">
            <Col>Lang: {post.LanguageName}</Col>
            <Col className="text-right">
              {" "}
              {format(new Date(post.created_on), "MM/dd/yyyy HH:mm")}
            </Col>
          </Row>
          <hr />
          <p>{post.PostText}</p>
          <div style={{ position: "absolute", bottom: "0", right: "1rem" }}>
            <Button
              onClick={() => {
                setOpenAddComment(true);
              }}
              variant="primary"
              className='mr-2'
            >
              Comment
          </Button>
            <Button
              disabled={isLiked || isFetching}
              variant="danger"
              onClick={() => {
                likeComment();
              }}
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
            Like {post.LikeCount}
            </Button>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default Post;
