import React, { Component } from 'react';
import '../App.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentAlt } from '@fortawesome/free-solid-svg-icons';
import { faPollH } from '@fortawesome/free-solid-svg-icons';
import { faTv } from '@fortawesome/free-solid-svg-icons';
import { faStickyNote } from '@fortawesome/free-solid-svg-icons';
import { faListUl } from '@fortawesome/free-solid-svg-icons';

class Nav extends Component {
    constructor() {
        super();
        this.state = {
            ProfilePicture: '',
            Users: [],
            canQuiz: false,
        }
    }

    componentDidMount() {
        this.fetchProfilePicture();
        this.quiz();
    }

    quiz = () => {
        let url = 'http://localhost:3001/flashcards/checkFlashcards';
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userID: localStorage.getItem("id"),
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.length < 4) {
                    this.setState({ canQuiz: false });
                } else {
                    this.setState({ canQuiz: true });
                }
            }).catch((error) => {
                alert('Failed to Save.');
            });
    }

    fetchProfilePicture = () => {
        let url = 'http://localhost:3001/profile/picture';

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },

            body: JSON.stringify({
                userID: localStorage.getItem("id"),
            })

        }).then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                if (responseJson.ProfilePicture !== null) {
                    this.setState({ ProfilePicture: responseJson.ProfilePicture.data });
                }
            }).catch((error) => {
                alert(error);
            });
    }

    logout = () => {
        // event.preventDefault();
        // console.log("log")
        localStorage.clear();
        // console.log(this.props);
        // browserHistory.push("/");
    }

    render() {
        let rows = [];
        let b64 = 0;
        let profPic = require('../images/DefaultPP.png');
        if (this.state.ProfilePicture !== '' && this.state.ProfilePicture !== null) {
            b64 = new Buffer(this.state.ProfilePicture).toString('base64');
            profPic = "data:image/png;base64," + b64;
        }

        return (
            <div>
                <nav className="navbar navbar-dark navbar-expand navigationPurple">
                    <Link href="#" to="/profile" className="nav-link">
                        <img src={profPic} alt="Avatar" className="avatar mr-2"></img>
                        <a className="navbar-brand font-weight-bold">{localStorage.getItem("username")}</a>
                    </Link>
                    {/* <label className="navbar-brand ml-5">{this.props.location.state.flashcardPackName} Pack</label> */}
                    <ul className="navbar-nav m-auto">
                        <li className="nav-item active" >
                            <a href="#" style={{ textDecoration: "none" }}><Link to="/chats" className="nav-link font-weight-bold"><FontAwesomeIcon icon={faCommentAlt} /> Chats</Link> <span class="sr-only">(current)</span></a>
                        </li>
                        <li className="nav-item">
                            <a href="#" style={{ textDecoration: "none" }}><Link to="/posts" className="nav-link font-weight-bold"><FontAwesomeIcon icon={faPollH} /> Posts</Link></a>
                        </li>
                        <li className="nav-item">
                            <a href="#" style={{ textDecoration: "none" }}><Link to="/mediaM" className="nav-link font-weight-bold"><FontAwesomeIcon icon={faTv} /> Media</Link></a>
                        </li>
                        <li className="nav-item" >
                            <a href="#" style={{ textDecoration: "none" }}><Link to="/search" className="nav-link font-weight-bold"><FontAwesomeIcon icon={faStickyNote} /> Flashcards</Link></a>
                        </li>
                        {this.state.canQuiz ?
                            <li className="nav-item">
                                <a href="#" style={{ textDecoration: "none" }}><Link to="/quizForm" className="nav-link font-weight-bold"><FontAwesomeIcon icon={faListUl} /> Quiz</Link></a>
                            </li>
                            : <div></div>}
                    </ul>

                    <Link to="/" className="btn btn-outline-danger" style={{ marginLeft: "10%" }} onClick={this.logout}>Log Out</Link>
                    {/* <button type="button" className="btn btn-outline-danger" onClick={this.logout} >Log Out</button> */}
                </nav>
            </div >
        );
    }
}

export default Nav;