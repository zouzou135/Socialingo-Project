import React, { Component } from 'react';
import '../App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import { faFilm } from '@fortawesome/free-solid-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { CountryDropdown } from 'react-country-region-selector';
import Footer from './footer';

class Register extends Component {
    constructor(props) {
        super(props);
        // This binding is necessary to make `this` work in the callback
        this.nextFunction = this.nextFunction.bind(this);
        this.state = {
            UserName: '', Email: '', Password: '', CPassword: '',
            user: {},
            disabled: '',
            Country: '',
            errors: {
                username: '',
                email: '',
                password: '',
                passwordMatch: '',
            }
        }
        this.popup = null;
    }

    componentDidMount() {
    }

    handleUserNameChange = event => {
        event.preventDefault();
        this.setState({ UserName: event.target.value });
    }

    handleEmailChange = event => {
        event.preventDefault();
        this.setState({ Email: event.target.value });
        const validEmailRegex =
            RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);
        this.state.errors.email =
            validEmailRegex.test(event.target.value)
                ? ''
                : 'Email is not valid!';
    }

    handlePasswordChange = event => {
        event.preventDefault();
        this.setState({ Password: event.target.value });
        this.state.errors.password =
            event.target.value.length < 8
                ? 'Password must be 8 characters long!'
                : '';

        this.state.errors.passwordMatch =
            (this.state.CPassword !== event.target.value && this.state.CPassword.length > 0)
                ? "Passwords don't match"
                : '';
    }

    handleConfirmPasswordChange = event => {
        event.preventDefault();
        this.setState({ CPassword: event.target.value });

        this.state.errors.passwordMatch =
            this.state.Password !== event.target.value
                ? "Passwords don't match"
                : '';

    }

    nextFunction = (event) => {

        event.preventDefault();
        const { UserName } = this.state;
        const { Password } = this.state;
        const { Email } = this.state;
        const { Country } = this.state;
        console.log(Country);
        let url = 'http://localhost:3001/register';

        var valid = true;
        Object.values(this.state.errors).forEach((val) => {
            if (val.length > 0)
                valid = false;
        }
        );

        // if (Password !== CPassword) {
        //     alert("Passwords do not match");
        // } else {
        if (valid) {
            // fetch(url, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({
            //         username: UserName,
            //         email: Email,
            //         password: Password,
            //         country: Country,
            //     })
            // }).then((response) => response.json())
            //     .then((responseJson) => {
            //         // console.log(responseText);
            //         alert(responseJson.msg);

            //         if (responseJson.msg === "Successful!") {
            //             alert(responseJson.result.insertId);
            // this.setState({ user: { username: UserName, email: Email, password: Password, country: Country } });
            localStorage.setItem("user", this.state.user);
            this.props.history.push('/register2', { user: { username: UserName, email: Email, password: Password, country: Country } });
            // } else {
            //     alert("User Already taken");
            // }

            //         }).catch((error) => {
            //             alert('Failed to Save.');
            //         });
            // }
        }
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

    selectCountry = (val) => {
        this.setState({ Country: val });
        // console.log(this.state.country)
    }

    render() {
        const { Country } = this.state;

        var passClass = "form-control w-50";
        if (this.state.errors.password.length > 0) {
            passClass = "form-control w-50 is-invalid";
        }
        var emailClass = "form-control w-50";
        if (this.state.errors.email.length > 0) {
            emailClass = "form-control w-50 is-invalid";
        }

        var passMClass = "form-control w-50";
        if (this.state.errors.passwordMatch.length > 0) {
            passMClass = "form-control w-50 is-invalid";
        }

        return (

            <div >
                <div className="wrapper1">
                    <div className="background containerR">
                        <div className="para">
                            <h3 className="App1"><FontAwesomeIcon icon={faComment} /> Chat with Natives</h3>
                            <h3 className="App1"><FontAwesomeIcon icon={faFilm} /> Get media suggestions</h3>
                            <h3 className="App1"><FontAwesomeIcon icon={faCheck} /> Get your sentences corrected</h3>
                        </div>
                    </div>

                    <div className="register-page">
                        <form onSubmit={this.nextFunction} method="POST" className="">
                            <div>
                                <h3 className="font-weight-bold" style={{ color: "purple" }}>Sign Up</h3>
                            </div>
                            <div className="form-group ">
                                <input className="form-control w-50" type="text" onChange={this.handleUserNameChange} name="username" id="username" placeholder="Username" required />
                            </div>
                            <div className="form-group ">
                                <input className={emailClass} type="text" onChange={this.handleEmailChange} name="email" id="email" placeholder="Email" required />
                                <span className='invalid-feedback'>{this.state.errors.email}</span>
                            </div>
                            <div className="form-group ">
                                <input className={passClass} type="password" onChange={this.handlePasswordChange} name="password" id="password" placeholder="Password" aria-describedby="passwordHelpInline" required />
                                <span className='invalid-feedback'>{this.state.errors.password}</span>
                            </div>
                            {/* <small id="passwordHelpInline" class="text-muted">Minimum 6 characters.</small> */}
                            <div className="form-group ">
                                <input className={passMClass} type="password" onChange={this.handleConfirmPasswordChange} name="password" id="passwordConfirm" placeholder="Confirm Password" required />
                                <span className='invalid-feedback'>{this.state.errors.passwordMatch}</span>
                            </div>
                            <div className="form-group ">
                                <CountryDropdown className="form-control w-50"
                                    value={Country}
                                    onChange={(val) => this.selectCountry(val)} required />

                            </div>
                            <input className="buttonL font-weight-bold" type="Submit" value="Next" />
                        </form>
                    </div>
                </div>
                <Footer></Footer>
            </div>

        );
    }
}

export default Register;