import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const initState = { languageId: "", text: "" };
const AddPost = ({
  showAddPost,
  setShowAddPost,
  langs,
  user,
  updateUserPosts,
}) => {
  const [state, setState] = useState({ ...initState });
  console.log(state);
  return (
    <Modal
      show={showAddPost}
      onHide={() => {
        setShowAddPost(false);
        setState({ ...initState });
      }}
    >
      <Modal.Header >
        <Modal.Title>Create a new post</Modal.Title>
      </Modal.Header>
      <Form
        onSubmit={async (e) => {
          e.preventDefault();
          const { languageId, text } = state;
          const userId = user && user.user.UserID;
          const userLngFluent = user && user.knownLang.map(el => el.LanguageName).join(', ')
          const userLngLearn = user && user.langToLearn.map(el => el.LanguageName).join(', ')
          if (!languageId || !text || !userId) return;
          const body = { languageId, text, userId, userLngFluent, userLngLearn };
          try {
            const res = await fetch("http://localhost:3001/post/user", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },

              body: JSON.stringify(body),
            });
            console.log(res);
            if (res.status === 200) {
              console.log("post create");
              setState({ ...initState });
              updateUserPosts();
              setShowAddPost(false);

            }
          } catch (error) {
            console.error(error);
          }
        }}
      >
        <Modal.Body>
          <Form.Group>
            <Form.Label>Language</Form.Label>
            <Form.Control
              as="select"
              required
              onChange={(e) =>
                setState({ ...state, languageId: e.target.value })
              }
            >
              <option value="">--Please choose a language--</option>
              {langs
                .filter(
                  (lang, i, arr) =>
                    i === arr.findIndex((x) => x.LanguageID === lang.LanguageID)
                )
                .map((lang) => (
                  <option key={lang.LanguageID} value={lang.LanguageID}>
                    {lang.LanguageName}
                  </option>
                ))}
            </Form.Control>
          </Form.Group>
          <Form.Group >
            <Form.Label >Post</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Add your text here"
              rows="3"
              value={state.text}
              required
              onChange={(e) => setState({ ...state, text: e.target.value })}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setState({ ...initState });
              setShowAddPost(false);
            }}
          >
            Close
          </Button>
          <Button variant="primary" type="submit">
            Save
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddPost;
