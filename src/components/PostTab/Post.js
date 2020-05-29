import React from "react";
import { format } from "date-fns";
import { Card, Row, Col, Image, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const Post = ({ post, avatar, user }) => {

  return (
    <Card className="p-3">
      <Row>
        <Col sm="4" className="border-right text-center">
          <p className="m-0 mb-2 text-secondary">{user.user.Username}</p>
          <Image
            src={avatar}
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
          <hr />
          <p className="m-0">
            <small>Likes: {post.LikeCount}</small>
            <br />
            <small>Comments: {post.nbComment}</small>
            <Button
              className="float-right"
              as={Link}
              to={"/post/" + post.PostID}
              variant="primary"
            >
              view more
            </Button>
          </p>
        </Col>
      </Row>
    </Card>
  );
};

export default Post;
