import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Alert, Spinner } from "react-bootstrap";
import Post from "./Post";
import AddComment from "./AddComment";
import Comment from "./Comment";
import Nav from "../custnav";

const PagePost = (props) => {
  console.log(props);
  const params = useParams();
  const { id } = params;
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState(null);
  const [user, setUser] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const [isOpenAddComment, setOpenAddComment] = useState(false);
  useEffect(() => {
    if (!id) return;
    setIsFetching(true);
    const fetchPosts = async () => {
      try {
        const res1 = await fetch("http://localhost:3001/profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userID: localStorage.getItem("id"),
          }),
        });
        const user = await res1.json();
        const res3 = await fetch(`http://localhost:3001/like/comment/user/${user.user.UserID}`);
        const userCommentLikes = await res3.json();
        const res4 = await fetch(`http://localhost:3001/like/post/user/${user.user.UserID}`);
        const userPostLikes = await res4.json();
        setUser({
          ...user,
          userCommentLikes: userCommentLikes.map((el) => el.CommentID),
          userPostLikes: userPostLikes.map((el) => el.PostID),
        });
        const res2 = await fetch("http://localhost:3001/post/" + id);
        console.log(res2.status);
        if (res2.status === 200) {
          const json = await res2.json();
          setPost(json.post);
          setComments(json.comments);
        }
      } catch (error) {
        console.error(error);
      }
      setIsFetching(false);
    };
    fetchPosts();
  }, [id]);

  const updateComments = (newComment) => {
    setComments((c) => [...c, newComment]);
  };
  const updateUserCommentLikes = (like) => {
    setUser((c) => ({ ...c, userCommentLikes: [...c.userCommentLikes, like] }));
  };
  const incrementCommentLike = (commentId) => {
    let c = [...comments];
    const commentIndex = c.findIndex((cmt) => cmt.CommentID === commentId);
    const comment = c[commentIndex];
    c[commentIndex] = { ...comment, LikeCount: comment.LikeCount + 1 };
    setComments(c);
  };
  const updateUserPostLikes = (postId) => {
    setUser((c) => ({ ...c, userPostLikes: [...c.userPostLikes, postId] }));
  };
  const incrementPostLike = () => {
    setPost((c) => ({ ...c, LikeCount: c.LikeCount + 1 }));
  };

  if (!post && !isFetching)
    return <Alert variant="warning">sorry there is not post</Alert>;

  return (
    <>
      <Nav />
      {isFetching ? (
        <Container className='d-flex justify-content-center mt-4'>
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </Container>
      ) : (
          <Container className="p-2 mt-4" style={{ maxWidth: "700px" }}>
            <Post
              post={post}
              setOpenAddComment={setOpenAddComment}
              user={user}
              incrementPostLike={incrementPostLike}
              updateUserPostLikes={updateUserPostLikes}
            />
            {isOpenAddComment && (
              <AddComment
                user={user}
                post={post}
                setOpenAddComment={setOpenAddComment}
                updateComments={updateComments}
              />
            )}
            <p className="mt-4" style={{ textDecoration: "underline" }}>
              Comments: {comments.length}
            </p>
            {comments.map((cmt) => (
              <Comment
                key={cmt.CommentID}
                comment={cmt}
                user={user}
                post={post}
                updateUserCommentLikes={updateUserCommentLikes}
                incrementCommentLike={incrementCommentLike}
              />
            ))}
          </Container>
        )}
    </>
  );
};

export default PagePost;
