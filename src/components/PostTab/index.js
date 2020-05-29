import React, { useState, useEffect } from "react";
import { Row, Button, Col, Spinner, Container } from "react-bootstrap";
import Post from "./Post";
import AddPost from "./AddPost";

const PostContainer = ({ avatar, user }) => {
  const knownLang = (user && user.knownLang) || [];
  const langToLearn = (user && user.langToLearn) || [];

  const [posts, setPosts] = useState([]);
  const [showAddPost, setShowAddPost] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const updateUserPosts = async () => {
    setIsFetching(true);
    try {
      const res = await fetch("/post/user/" + user.user.UserID);
      console.log("status =", res.status);
      const posts = await res.json();
      setPosts(posts);
    } catch (error) {
      console.error(error);
    }
    setIsFetching(false);
  };


  useEffect(() => {
    if (!user.user) return;
    setIsFetching(true);
    console.log("post useeffect user =", user.user.UserID);
    const user_langs = user.knownLang.concat(user.langToLearn).map(el => el.LanguageID)
    localStorage.setItem('user_langs', JSON.stringify(user_langs))
    const fetchPosts = async () => {
      try {
        const res = await fetch("http://localhost:3001/post/user/" + user.user.UserID);
        console.log("status =", res.status);
        const posts = await res.json();
        setPosts(posts);
      } catch (error) {
        console.error(error);
      }
      setIsFetching(false);
    };
    fetchPosts();
  }, [user]);

  if (isFetching)
    return (
      <Container className='d-flex justify-content-center mt-4'>
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </Container>
    );

  return (
    <section className="p-3 bg-white rounded bottom-shadow">
      <Row noGutters>
        <Button
          onClick={() => {
            setShowAddPost(true);
          }}
          variant="primary"
          className="ml-auto"
        >
          create a post
        </Button>
      </Row>
      <hr className="w-100" />
      <Row noGutters>
        {posts.length ? (
          posts.map((post, i) => (
            <Col key={i} xs={12} sm={6} md={4} className="mb-2 p-2">
              <Post avatar={avatar} post={post} user={user} />
            </Col>
          ))
        ) : (
            <p className="text-muted text-center mx-auto">
              you currently have no post . start by creating one
            </p>
          )}
      </Row>
      <AddPost
        showAddPost={showAddPost}
        setShowAddPost={setShowAddPost}
        langs={[...knownLang, ...langToLearn]}
        user={user}
        updateUserPosts={updateUserPosts}
      />
    </section>
  );
};

export default PostContainer;
