import React, { Component } from 'react';
import '../App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import { faFilm } from '@fortawesome/free-solid-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import Footer from './footer';

class Register2 extends Component {
    constructor(props) {
        super(props);
        // This binding is necessary to make `this` work in the callback
        this.nextFunction = this.nextFunction.bind(this);
        this.state = {
            Languages: [],
            LSelected: [],
            LanguageKnown: [],
            user: {},
        }
        this.popup = null;
    }

    componentDidMount() {
        this.fetchLanguages();
    }

    fetchLanguages = () => {

        let url = 'http://localhost:3001/login/languages';

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },

            body: JSON.stringify({

            })

        }).then((response) => response.json())
            .then((responseJson) => {
                this.setState({ Languages: responseJson });
                for (var i = 0; i < responseJson.length; i++) {
                    // var joined = this.state.LSelected.concat(false);
                    // this.setState({ LSelected: joined })
                    this.setState({ LSelected: [...this.state.LSelected, false] });
                    // this.state.LSelected.push(false);
                }
                // console.log(responseJson);
            }).catch((error) => {
                alert(error);
            });
    }

    languageCheck = () => event => {
        event.preventDefault();
        if (this.state.LSelected[event.target.id - 1] === false) {
            // var joined = this.state.LanguageKnown.concat(event.target.name);
            // this.setState({ LanguageKnown: joined });
            this.setState({ LanguageKnown: [...this.state.LanguageKnown, event.target.id] }, () => {
                console.log(this.state.LanguageKnown)
            });
            // console.log(this.state.LanguageKnown);
            // this.state.LanguageKnown.push(event.target.name);
            let editableLSelected = [...this.state.LSelected];
            editableLSelected[event.target.id - 1] = true;
            this.setState({ LSelected: editableLSelected });
        } else {
            let remove = this.state.LanguageKnown.indexOf(event.target.id);
            this.setState({
                LanguageKnown: this.state.LanguageKnown.filter((_, i) => i !== remove)
            },
                () => {
                    console.log(this.state.LanguageKnown);
                }
            );
            // this.state.LanguageKnown.pop(event.target.name);
            let editableLSelected = [...this.state.LSelected];
            editableLSelected[event.target.id - 1] = false;
            this.setState({ LSelected: editableLSelected });
        }
        // console.log(this.state.LSelected);
    }

    nextFunction = (event) => {

        event.preventDefault();
        var User = this.props.location.state.user;
        console.log(User);
        // var UserName = this.props.location.state.user.username;
        // var Password = this.props.location.state.user.password;
        // var Email = this.props.location.state.user.email;
        // var Country = this.props.location.state.user.country;
        // let url = 'http://localhost:3001/register';

        // var valid = true;
        // Object.values(this.state.errors).forEach((val) => {
        //     if (val.length > 0)
        //         valid = false;
        // }
        // );

        // if (Password !== CPassword) {
        //     alert("Passwords do not match");
        // } else {
        // if (valid) {
        // fetch(url, {
        //     method: 'GET',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     }
        // }).then((response) => response.json())
        //     .then((responseJson) => {
        //         // console.log(responseText);
        //         alert(responseJson.msg);

        // if (responseJson.msg === "Successful!") {
        // alert(responseJson.result.insertId);
        // this.setState({ user: { id: responseJson.result.insertId, username: UserName, email: Email, password: Password, country: Country } });
        // localStorage.setItem("id", responseJson.result.insertId);
        this.props.history.push('/register3', { user: { username: User.username, email: User.email, password: User.password, country: User.country }, languagesKnown: this.state.LanguageKnown });
        // } else {
        //     alert("User Already taken");
        // }

        // }).catch((error) => {
        //     alert('Failed to Save.');
        // });
        // }
        // }
    }

    // componentClicked = () => {
    //     console.log("facebook login clicked");
    // }

    // responseFacebook = (response) => {
    //     console.log(response);
    //     // event.preventDefault();
    //     var userName = response.name;
    //     let url = 'http://localhost:3001/registerFacebook';


    //     fetch(url, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({
    //             username: userName,
    //         })
    //     }).then((response) => response.json())
    //         .then((responseJson) => {
    //             // console.log(responseText);
    //             // alert(responseJson.result);
    //             // alert(responseJson.result.insertId);
    //             localStorage.setItem("id", responseJson.result);
    //             this.props.history.push('/profile', { id: responseJson.result });

    //         }).catch((error) => {
    //             alert('Failed to Save.');
    //         });


    // }

    render() {
        let rows = [];
        // var lSelected = this.state.LSelected;

        const contents = this.state.Languages.forEach((item, key) => {
            rows.push(
                <div className="col-sm-3">
                    <div className="card my-3" >
                        <div className="card-body" style={this.state.LSelected[key] ? { backgroundColor: "purple", color: "white" } : {}}>
                            <a href="#" class="stretched-link" id={item.LanguageID} name={item.LanguageName} onClick={this.languageCheck()}></a>
                            <p className="card-text font-weight-bold" style={{ textAlign: "center", height: "45px" }}>{item.LanguageName}</p>
                        </div>
                    </div >
                </div >);
        });

        return (

            <div>
                <div className="background containerR">
                    <div className="para">
                        <h3 className="App1"><FontAwesomeIcon icon={faComment} /> Chat with Natives</h3>
                        <h3 className="App1"><FontAwesomeIcon icon={faFilm} /> Get media suggestions</h3>
                        <h3 className="App1"><FontAwesomeIcon icon={faCheck} /> Get your sentences corrected</h3>
                    </div>
                </div>
                <div className="background2 container2">
                </div>

                <div style={{ marginLeft: "50%", marginBottom: "45px" }}>
                    <div>
                        <h3 className="font-weight-bold my-3" style={{ color: "purple", textAlign: "center" }}>Select the languages you're fluent in</h3>
                    </div>
                    <div className="row mx-2">
                        {rows}
                    </div>
                    <form onSubmit={this.nextFunction} method="POST" className="">
                        <input className="buttonL font-weight-bold mx-3" type="Submit" value="Next" />
                    </form>
                </div>
                <Footer></Footer>
            </div >

        );
    }
}

export default Register2;