import React, { Component } from 'react';
import '../App.css';
import { Link } from 'react-router-dom';
import Nav from './custnav';

class ChatsHistory extends Component {
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

    addToChat = (event, profPic) => {
        event.preventDefault();
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
                usersAdded: true,
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
                <div className="profileContainer Contain1">
                    <img src={profPic1} alt="Avatar" className="profilePic mr-2"></img>
                    <a className="navbar-brand font-weight-bold">{item.user.Username}</a>
                    <div className="textInProfile ml-3" style={{ position: "relative" }}>
                        <div className=" mt-3">Country: {country}</div>
                        <div>Fluent in: {languagesKnown}</div>
                        <div>Learning: {languagesToLearn}</div>
                        <button id={item.user.Username} onClick={(e) => {
                            this.addToChat(e, item.user.ProfilePicture)
                        }} style={{ right: "5%", bottom: "0", position: "absolute" }} className="buttonL font-weight-bold" >Chat</button>
                    </div>
                </div>
            );
        })




        return (
            <div>
                <Nav></Nav>
                <ul className="nav nav-pills mt-3" style={{ marginLeft: "44%", borderColor: "purple", borderStyle: "solid", borderRadius: "8px", width: "195.5px", marginBottom: "-3%" }} id="pills-tab" role="tablist">
                    <li className="nav-item">
                        <Link className="nav-link active" style={{ color: "purple", backgroundColor: "#eee" }} id="pills-home-tab" data-toggle="pill" to="/chats" role="tab" aria-controls="pills-home" aria-selected="false">Add People</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" id="pills-profile-tab" style={{ backgroundColor: "purple", color: "white" }} data-toggle="pill" role="tab" aria-controls="pills-profile" aria-selected="true">Chats</Link>
                    </li>
                </ul>
                {rows}
            </div >
        );
    }
}

export default ChatsHistory;