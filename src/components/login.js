import React, { Component } from 'react';
import '../App.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import { faFilm } from '@fortawesome/free-solid-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import logo from '../images/SocialingoLogo.png'
import Footer from './footer';

class Login extends Component {
    constructor(props) {
        super(props);
        // This binding is necessary to make `this` work in the callback
        this.loginFunction = this.loginFunction.bind(this);
        this.state = { UserName: '', Password: '', wrongPass: false }
    }

    componentDidMount() {

    }

    handleUserNameChange = event => {
        event.preventDefault();
        this.setState({ UserName: event.target.value });
    }

    handlePasswordChange = event => {
        event.preventDefault();
        this.setState({ Password: event.target.value });
    }

    loginFunction = (event) => {

        event.preventDefault();
        const { UserName } = this.state;
        const { Password } = this.state;
        console.log(UserName + "  " + Password);
        let url = 'http://localhost:3001/login';

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: UserName,
                password: Password,
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                // console.log(responseText);
                // alert(responseJson.msg);



                if (responseJson.msg === "Successful") {
                    localStorage.setItem("id", responseJson.result[0].UserID);
                    localStorage.setItem("username", UserName);
                    this.props.history.push('/profile', { id: responseJson.result[0].UserID });
                } else {
                    this.setState({ wrongPass: true });
                }

            }).catch((error) => {
                alert('Failed to Save.');
            });
    }

    responseFacebook = (response) => {
        console.log(response);
        // event.preventDefault();
        var userName = response.name;
        let url = 'http://localhost:3001/registerFacebook';


        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: userName,
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                // console.log(responseText);
                // alert(responseJson.result);
                // alert(responseJson.result.insertId);
                localStorage.setItem("id", responseJson.result);
                localStorage.setItem("username", userName);
                this.props.history.push('/profile', { id: responseJson.result });

            }).catch((error) => {
                alert('Failed to Save.');
            });


    }

    render() {

        return (
            <div>
                <div className="wrapper">
                    <div className="background containerR">
                        <div className="para">
                            <h3 className="App1"><FontAwesomeIcon icon={faComment} /> Chat with Natives</h3>
                            <h3 className="App1"><FontAwesomeIcon icon={faFilm} /> Get media suggestions</h3>
                            <h3 className="App1"><FontAwesomeIcon icon={faCheck} /> Get your sentences corrected</h3>
                        </div>
                    </div>
                    <div className="login-page">
                        <form onSubmit={this.loginFunction} method="POST" className="">
                            <div>
                                <h3 className="font-weight-bold" style={{ color: "purple" }}>Login To <img width="30%" src={logo}></img></h3>
                            </div>
                            <div>
                                {this.state.wrongPass ? <span style={{ color: "red", fontSize: "12px" }}>Wrong username or password</span> : <span></span>}
                            </div>
                            <div className="form-group">
                                <input className="form-control w-50" type="text" onChange={this.handleUserNameChange} name="username" id="username" placeholder="Username" />
                            </div>
                            <div className="form-group">
                                <input className="form-control w-50" type="password" onChange={this.handlePasswordChange} name="password" id="password" placeholder="Password" />
                            </div>
                            <input className="buttonL font-weight-bold" type="Submit" value="LOGIN" />
                            {/* <label className="form-label"></label> */}
                            <div className="my-3">New to Socialingo?<Link to="/register" className="font-weight-bold" style={{ textDecoration: "none" }}> SIGN UP </Link></div>
                        </form>
                    </div>
                </div>
                <Footer></Footer>
            </div>
        );
    }
}

export default Login;