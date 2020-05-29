import React, { Component } from 'react';
import '../App.css';
import { Link } from 'react-router-dom';
import Nav from './custnav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

class Comp1 extends Component {
    constructor() {
        super();
        this.deleteRecord = this.deleteRecord.bind(this);
        this.fillForm = this.fillForm.bind(this);
        this.state = {
            data: [],
            notMaker: [],
        }
    }

    redirectToHome = () => {
        // const { history } = this.props;
        // if (history) history.push('/UserForm');
    }

    componentDidMount() {
        this.checkIfMaker();
        this.fetchUsers();
    }

    checkIfMaker = () => {

        let url = 'http://localhost:3001/flashcards/checkFCP';

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },

            body: JSON.stringify({
                userId: localStorage.getItem("id"),
            })

        }).then((response) => response.json())
            .then((responseJson) => {
                for (let i = 0; i < responseJson.length; i++) {
                    this.state.notMaker.push(responseJson[i].FlashcardPack_FlashcardPackID);
                }
            }).catch((error) => {
                alert(error);
            });
    }

    fetchUsers = () => {

        let url = 'http://localhost:3001/flashcards/flashcardPacks';

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },

            body: JSON.stringify({
                userId: localStorage.getItem("id"),
            })

        }).then((response) => response.json())
            .then((responseJson) => {
                this.setState({ data: responseJson });
            }).catch((error) => {
                alert(error);
            });
    }

    deleteRecord = (event) => {
        event.preventDefault();


        let url = 'http://localhost:3001/flashcards/deleteFlashcardPack';
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                flashcardPackID: event.target.id,
                userID: localStorage.getItem("id"),
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                this.checkIfMaker();
                this.fetchUsers();

            }).catch((error) => {
                alert('Failed to Save.');
            });
    }

    removeButton = item => event => {
        event.preventDefault();

        let url = 'http://localhost:3001/flashcards/removeFlashcardPack';

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },

            body: JSON.stringify({
                userID: localStorage.getItem("id"),
                flashcardPackID: item.FlashcardPackID,
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
            }).catch((error) => {
                alert(error);
            });
        this.checkIfMaker();
        this.fetchUsers();
    }

    fillForm = item => event => {
        event.preventDefault();
        this.props.history.push('/flashcardPackForm', {
            flashcardPackID: item.FlashcardPackID, flashcardPackName: item.FlashcardPackName, flashcardPackDescription: item.FlashcardPackDescription, userID: localStorage.getItem("id")
        });
    }

    fillForm1 = () => event => {
        event.preventDefault();
        this.props.history.push('/flashcardPackForm', { userID: localStorage.getItem("id") });
    }

    flashcard = () => event => {
        event.preventDefault();
        var isMaker = true;
        for (let i = 0; i < this.state.notMaker.length; i++) {
            if (event.target.id == this.state.notMaker[i]) {
                isMaker = false;
            }
        }
        if (isMaker) {
            this.props.history.push('/flashcards', { flashcardPackID: event.target.id, flashcardPackName: event.target.name });
        } else {
            this.props.history.push('/flashcards', { flashcardPackID: event.target.id, flashcardPackName: event.target.name, canEdit: false });
        }
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
                    alert("You need to have at least 4 flashcards")
                } else {
                    this.props.history.push('/quizForm', { flashcards: responseJson });
                }

            }).catch((error) => {
                alert('Failed to Save.');
            });
    }

    handleResponse = (data) => {
        console.log(data);
    }
    handleError = (error) => {
        this.setState({ error });
    }

    render() {
        let rows = [];
        console.log(this.state.notMaker[0]);

        const contents = this.state.data.forEach((item, key) => {
            var isMaker = true;
            for (let i = 0; i < this.state.notMaker.length; i++) {
                if (item.FlashcardPackID === this.state.notMaker[i]) {
                    isMaker = false;
                }
            }
            rows.push(
                <div className="col-sm-3">
                    <div className="card my-3" style={{ borderRadius: "30px", borderWidth: "0px", boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)" }}>
                        <h5 className="card-header" style={{ transform: "rotate(0)", color: "purple", backgroundColor: "purple", borderTopLeftRadius: "30px", borderTopRightRadius: "30px" }} ><a href="" class="stretched-link" id={item.FlashcardPackID} name={item.FlashcardPackName} style={{ textDecoration: "none", color: "white" }} onClick={this.flashcard()}>{item.FlashcardPackName}</a></h5>
                        <div className="card-body">
                            <p className="card-text">{item.FlashcardPackDescription}</p>
                            {isMaker ?
                                <div>
                                    <button onClick={this.fillForm(item)} className="btn btn-secondary raised mr-1" >Edit</button>
                                    <button id={item.FlashcardPackID} onClick={this.deleteRecord} className="btn btn-secondary raised">Delete</button>
                                </div>
                                : <button onClick={this.removeButton(item)} className="btn btn-secondary raised mr-1" >Remove</button>}
                        </div>
                    </div >
                </div >);
        })
        return (
            <div>
                <Nav></Nav>
                <div className="container">
                    <div className="row">
                        {rows}
                    </div>
                </div>
                <button onClick={this.fillForm1()} className="btn addButtonF"><FontAwesomeIcon icon={faPlus} /></button>
            </div >
        );
    }
}

export default Comp1;