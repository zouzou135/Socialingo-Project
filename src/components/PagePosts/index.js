import React, { useEffect, useState } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import Post from "./Post";
import Nav from "../custnav";

const PagePost = () => {
  const [posts, setPosts] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  useEffect(() => {
    const fetchPosts = async () => {
      setIsFetching(true);
      try {
        const userLngs = localStorage.getItem("user_langs");
        const res = await fetch("http://localhost:3001/post/lang", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: userLngs,
        });
        const posts = await res.json();
        setPosts(posts);
      } catch (error) {
        console.error(error);
      }
      setIsFetching(false);
    };
    fetchPosts();
  }, []);
  if (isFetching)
    return (
      <>
        <Nav />
        <Container className='d-flex justify-content-center mt-4'>
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </Container>
      </>
    );

  return (
    <>
      <Nav />
      <Container fluid className="mt-4">
        <Row noGutters>
          {posts.length ? (
            posts.map((post, i) => (
              <Col key={i} xs={12} sm={6} md={4} className="mb-2 p-2">
                <Post post={post} />
              </Col>
            ))
          ) : (
              <p className="text-muted text-center mx-auto">There is no post</p>
            )}
        </Row>
      </Container>
    </>
  );
};

export default PagePost;
