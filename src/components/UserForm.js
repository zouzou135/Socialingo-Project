import React, { Component } from 'react';
import '../App.css';
import { Link } from 'react-router-dom';
import Toggle from 'react-toggle';

class UserForm extends Component {

    constructor(props) {
        super(props);
        // This binding is necessary to make `this` work in the callback
        this.FlashcardPackFunction = this.FlashcardPackFunction.bind(this);
        this.state = {
            FlashcardPackName: '', FlashcardPackDescription: '',
            Language: '',
            Languages: [],
            onlyImage: false,
        }
    }

    componentDidMount() {
        this.fetchLanguages();
    }

    handleFPNameChange = event => {
        event.preventDefault();
        this.setState({ FlashcardPackName: event.target.value });
    }

    handleFPDescriptionChange = event => {
        event.preventDefault();
        this.setState({ FlashcardPackDescription: event.target.value });
    }

    fetchLanguages = () => {

        let url = 'http://localhost:3001/suggestion/languages';

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
                this.setState({ Languages: responseJson });
            }).catch((error) => {
                alert(error);
            });
    }

    handleLanguageChange = event => {
        event.preventDefault();
        this.setState({ Language: event.target.value });
    }

    FlashcardPackFunction = (event) => {

        event.preventDefault();
        const { FlashcardPackName } = this.state;
        const { FlashcardPackDescription } = this.state;
        const { Language } = this.state;
        let FlashcardPackID = '';
        let UserID = this.props.location.state.userID;
        const { onlyImage } = this.state;


        let url = '';

        if (this.props.location.state.flashcardPackID === undefined) {
            url = 'http://localhost:3001/flashcards/addFlashcardPack';
        } else {
            FlashcardPackID = this.props.location.state.flashcardPackID;

            url = 'http://localhost:3001/flashcards/updateFlashcardPack';
        }

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                flashcardPackName: FlashcardPackName,
                flashcardPackDescription: FlashcardPackDescription,
                flashcardPackID: FlashcardPackID,
                userID: UserID,
                language: Language,
                imageOnly: onlyImage,
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                if (this.props.location.state.flashcardPackID === undefined) {
                    console.log(responseJson);
                    this.props.history.push('/flashcardForm', { flashcardPackID: responseJson.insertId, flashcardPackName: FlashcardPackName });
                } else {
                    this.props.history.push('/profile');
                }

            }).catch((error) => {
                alert('Failed to Save.');
            });
    }

    handleImageChange = (event) => {
        event.preventDefault();

        if (!this.state.onlyImage) {
            this.setState({ onlyImage: true });

        } else {
            this.setState({ onlyImage: false });

        }
    }

    render() {
        let options = [];

        const contents = this.state.Languages.forEach((item, key) => {
            options.push(
                <option value={item.LanguageID}>{item.LanguageName}</option>);
        });


        let nextOrSave = "";
        if (this.props.location.state.flashcardPackID === undefined) {
            nextOrSave = "Next";
        } else {
            nextOrSave = "Save";
        }

        return (
            <div style={{ marginTop: "5%" }} className="App Contain3">
                <form onSubmit={this.FlashcardPackFunction} method="POST" className="">
                    <div className="row">
                        <h1 className="text-white">Flashcard Pack Information</h1>
                    </div>
                    <div style={{ marginLeft: "36%" }} className="row form-group">
                        <Link to="/profile"> Go back to Profile </Link>
                    </div>
                    <div className="form-group row">
                        <label style={{ fontWeight: "bold" }} className="text-white form-label" htmlFor="fcL">Flashcard Pack Language</label>
                        <select className="form-control" value={this.state.value} onChange={this.handleLanguageChange} required>
                            <option value="" selected disabled hidden>Language</option>
                            {options}
                        </select>
                    </div>
                    <div className="form-group row">
                        <label style={{ fontWeight: "bold" }} className="text-white form-label" htmlFor="fcPN">Flashcard Pack Name</label>
                        <input className="form-control" type="text" onChange={this.handleFPNameChange} id="FPName" name="FPName" placeholder={(this.props.location.state !== undefined) ? this.props.location.state.flashcardPackName : 'Flashcard Pack Name'} required size="10" /><br />
                    </div>
                    <div className="form-group row">
                        <label style={{ fontWeight: "bold" }} className="text-white form-label" htmlFor="fcPR">Flashcard Pack Description</label>
                        <textarea className="form-control animated" type="text" id="FPDescription" name="FPDescription" onChange={this.handleFPDescriptionChange} placeholder={(this.props.location.state !== undefined) ? this.props.location.state.flashcardPackDescription : 'Flashcard Pack Description'} required size="10" /><br />
                    </div>
                    <div className="form-group row">
                        <label className="form-label white-text" style={{ fontWeight: "bold" }} htmlFor="fcImage">Only show image in the quiz</label>
                        <Toggle
                            className="ml-5"
                            id='record-status'
                            checked={this.state.onlyImage}
                            onChange={this.handleImageChange}
                            icons={false}
                        />
                    </div>
                    <input className="btn btn-dark raised" type="submit" value={nextOrSave} />
                </form>
            </div>
        );
    }
}

export default UserForm;