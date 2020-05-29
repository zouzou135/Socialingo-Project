import React, { Component } from 'react';
import '../App.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentAlt } from '@fortawesome/free-solid-svg-icons';
import { faPollH } from '@fortawesome/free-solid-svg-icons';
import { faTv } from '@fortawesome/free-solid-svg-icons';
import Nav from './custnav';

class Chats extends Component {
    constructor() {
        super();
        this.state = {
            ProfilePicture: '',
            Users: [],
        }
    }

    // redirectToHome = () => {
    //     const { history } = this.props;
    //     if (history) history.push('/UserForm');
    // }

    componentDidMount() {
        this.fetchUsers();
    }

    addToChat = (event, profPic, id) => {
        event.preventDefault();

        let url = 'http://localhost:3001/chats/addToChat';

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },

            body: JSON.stringify({
                userID: localStorage.getItem("id"),
                otherUserID: id,
            })

        }).then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                this.setState({ Users: responseJson });
            }).catch((error) => {
                alert(error);
            });

        this.props.history.push('/chatBox', { id: event.target.id, profPic: profPic });
    }

    fetchUsers = () => {

        let url = 'http://localhost:3001/chats';

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },

            body: JSON.stringify({
                userID: localStorage.getItem("id"),
                usersAdded: false,
            })

        }).then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                this.reorderUsers(responseJson);
            }).catch((error) => {
                alert(error);
            });
    }

    reorderUsers = usersArray => {
        let url = 'http://localhost:3001/chats/numberOfChats';

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },

            body: JSON.stringify({
                usersArray: usersArray
            })

        }).then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                this.setState({ Users: responseJson });
            }).catch((error) => {
                alert(error);
            });
    }



    render() {
        let rows = [];
        let b64 = 0;

        const contents = this.state.Users.forEach((item, key) => {
            let profPic1 = require('../images/DefaultPP.png');
            let country = '';
            if (item.user.ProfilePicture !== '' && item.user.ProfilePicture !== null) {
                b64 = new Buffer(item.user.ProfilePicture).toString('base64');
                profPic1 = "data:image/png;base64," + b64;
            }

            let languagesKnown = '';
            let languagesToLearn = '';
            console.log(item);
            if (item !== '') {
                country = item.user.UserCountry;
                for (var i = 0; i < item.knownLang.length; i++) {
                    languagesKnown += item.knownLang[i].LanguageName;
                    if (i !== item.knownLang.length - 1) {
                        languagesKnown += ", ";
                    }
                    else {
                        languagesKnown += ".";
                    }
                }

                for (var j = 0; j < item.langToLearn.length; j++) {
                    languagesToLearn += item.langToLearn[j].LanguageName;
                    if (j !== item.langToLearn.length - 1) {
                        languagesToLearn += ", ";
                    }
                    else {
                        languagesToLearn += ".";
                    }
                }
            }
            rows.push(
                <div className="col-sm-4">
                    <div className="chatContainer mx-2">
                        <img src={profPic1} alt="Avatar" className="profilePic mr-2"></img>
                        <a className="navbar-brand font-weight-bold">{item.user.Username}</a>
                        <div className="textInProfile ml-3" style={{ position: "relative" }}>
                            <div className=" mt-2">Country: {country}</div>
                            <div>Fluent in: {languagesKnown}</div>
                            <div>Learning: {languagesToLearn}</div>
                            <button id={item.user.Username} onClick={(e) => {
                                this.addToChat(e, item.user.ProfilePicture, item.user.UserID)
                            }} style={{ right: "5%", top: "-130%", position: "absolute" }} className="buttonL font-weight-bold" >Add</button>
                        </div>
                    </div>
                </div>
            );
        })




        return (
            <div>
                <Nav></Nav>
                <ul className="nav nav-pills mt-3" style={{ marginLeft: "44%", borderColor: "purple", borderStyle: "solid", borderRadius: "8px", width: "195.5px" }} id="pills-tab" role="tablist">
                    <li className="nav-item">
                        <Link className="nav-link active" style={{ backgroundColor: "purple" }} id="pills-home-tab" data-toggle="pill" role="tab" aria-controls="pills-home" aria-selected="true">Add People</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" id="pills-profile-tab" style={{ color: "purple" }} data-toggle="pill" to="/chatHistory" role="tab" aria-controls="pills-profile" aria-selected="false">Chats</Link>
                    </li>
                </ul>
                <div className="row">
                    {rows}
                </div>
            </div >
        );
    }
}

export default Chats;