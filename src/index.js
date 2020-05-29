import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import "bootstrap/dist/css/bootstrap.css";
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router, Route, HashRouter } from "react-router-dom";
import Login from "./components/login";
import Register from "./components/register";
import Register2 from "./components/register2";
import Register3 from "./components/register3";
import Register4 from "./components/register4";
import Profile from "./components/profile";
import Chats from './components/chats';
import ChatsHistory from './components/chatsHistory';
import ChatBox from './components/chatBox';
import Movies from './components/mediaMovies';
import Songs from './components/mediaSongs';
import News from './components/mediaNews';
import MovieForm from './components/movieForm';
import SongForm from './components/songForm';
import Flashcard from './components/flashcards';
import FlashcardForm from './components/flashcardForm';
import QuizForm from './components/quizForm';
import Quiz from './components/quiz';
import Search from './components/search';
import Comp1 from "./components/comp1";
import UserForm from "./components/UserForm";
import PagePosts from "./components/PagePosts"
import PagePost from "./components/PagePost"
// import Nav from './components/custnav';

class RouterNavigationSample extends React.Component {
    render() {
        return (
            <Router>
                <>
                    <Route
                        exact
                        path="/"
                        render={props => <Login {...props} />} />

                    <Route path="/register" render={props => <Register {...props} />} />
                    <Route path="/register2" render={props => <Register2 {...props} />} />
                    <Route path="/register3" render={props => <Register3 {...props} />} />
                    <Route path="/register4" render={props => <Register4 {...props} />} />
                    <Route path="/profile" render={props => <Profile {...props} />} />
                    <Route path="/chats" render={props => <Chats {...props} />} />
                    <Route path="/chatBox" render={props => <ChatBox {...props} />} />
                    <Route path="/chatHistory" render={props => <ChatsHistory {...props} />} />
                    <Route path="/mediaM" render={props => <Movies {...props} />} />
                    <Route path="/mediaS" render={props => <Songs {...props} />} />
                    <Route path="/mediaN" render={props => <News {...props} />} />
                    <Route path="/movieForm" render={props => <MovieForm {...props} />} />
                    <Route path="/songForm" render={props => <SongForm {...props} />} />
                    {/* <Route path="/nav" render={props => <Nav {...props} />} /> */}

                    <Route path="/flashcards" render={props => <Flashcard {...props} />} />

                    <Route path="/flashcardForm" render={props => <FlashcardForm {...props} />} />

                    <Route path="/quizForm" render={props => <QuizForm {...props} />} />

                    <Route path="/quiz" render={props => <Quiz {...props} />} />

                    <Route path="/search" render={props => <Search {...props} />} />

                    <Route path="/flashcardPacks" render={props => <Comp1 {...props} />} />

                    <Route path="/FlashcardPackForm" render={props => <UserForm {...props} />} />
                    <Route
                        path="/posts"
                        render={(props) => <PagePosts {...props} />}
                    />
                    <Route
                        path="/post/:id"
                        render={(props) => <PagePost {...props} />}
                    />
                </>
            </Router>
        );
    }
}
ReactDOM.render(<RouterNavigationSample />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
