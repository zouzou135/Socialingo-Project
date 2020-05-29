import React, { Component } from 'react';
import '../App.css';
import { Link } from 'react-router-dom';
import Nav from './custnav';


class QuizForm extends Component {

    constructor(props) {
        super(props);
        // This binding is necessary to make `this` work in the callback
        this.quizFunction = this.quizFunction.bind(this);
        this.state = { value: 2, flashcards: '', data: [], flashcardPacks: [], flashcardPack: '' }
    }

    componentDidMount() {
        this.fetchQuizes();
        console.log(this.props.location.state);
        this.fetchFlashcards(this.state.flashcardPack);
        this.fetchFlashcardPacks();
    }

    fetchFlashcards = (fCPID) => {
        // if (this.props.location.state === undefined) {
        let url = 'http://localhost:3001/flashcards/checkFlashcards';
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userID: localStorage.getItem("id"),
                flashcardPackID: fCPID,
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                this.setState({ flashcards: responseJson });
            }).catch((error) => {
                alert('Failed to Save.');
            });

        // } else {
        //     this.setState({ flashcards: this.props.location.state.flashcards });
        // }
    }

    fetchFlashcardPacks = () => {
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
                console.log(responseJson);
                this.setState({ flashcardPacks: responseJson });
            }).catch((error) => {
                alert('Failed to Save.');
            });
    }

    handleChange = event => {
        event.preventDefault();
        this.setState({ value: event.target.value });
    }

    handleChangeFCP = event => {
        event.preventDefault();
        this.setState({ flashcardPack: event.target.value });
        this.fetchFlashcards(event.target.value);
    }

    quizFunction = (event) => {

        event.preventDefault();
        const { value } = this.state.value;
        this.props.history.push('/quiz', { numberOfQuestions: this.state.value, flashcards: this.state.flashcards, flashcardPackID: this.state.flashcardPack });
    }

    quizFunction1 = item => event => {

        event.preventDefault();
        this.fetchFlashcards(item.QFlashcardPackID);
        this.props.history.push('/quiz', { numberOfQuestions: item.NumberOfQuestions, flashcards: this.state.flashcards, questionsComleted: item.QuestionsComleted, rightAnswer: item.rightAnswers, quizID: item.QuizID, flashcardPackID: item.QFlashcardPackID });
    }

    fetchQuizes = () => {

        let url = 'http://localhost:3001/flashcards/quizes';

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

    render() {
        let rows = [];
        let options = [];

        for (var i = 0; i < 100; i++) {
            options.push(<option value={i + 1}>{i + 1} Questions</option>);
        }

        let options1 = [];
        options1.push(
            <option value={''}>All</option>);

        const contents1 = this.state.flashcardPacks.forEach((item, key) => {
            var count = 0;
            for (var i = 0; i < this.state.flashcards.length; i++) {
                if (item.FlashcardPackID === this.state.flashcards[i].FlashcardPackID) {
                    count++;
                }
            }
            if (count >= 4) {
                options1.push(
                    <option value={item.FlashcardPackID}>{item.FlashcardPackName}</option>);
            }
        });

        const contents = this.state.data.forEach((item, key) => {
            var FCPName = "All";

            for (var i = 0; i < this.state.flashcardPacks.length; i++) {
                if (this.state.flashcardPacks[i].FlashcardPackID === item.QFlashcardPackID) {
                    FCPName = this.state.flashcardPacks[i].FlashcardPackName;
                }
            }

            rows.push(
                <div className="col-sm-3">
                    <div className="card m-3">
                        <h5 className="card-header transform-title bg-danger" ><a href="" class="stretched-link" id={item.QuizID} onClick={this.quizFunction1(item)} style={{ textDecoration: "none", color: "white" }} >Continue Quiz</a></h5>
                        <div className="card-body">
                            <p className="card-text">{FCPName}</p>
                            <p className="card-text">{item.QuestionsComleted - 1}/{item.NumberOfQuestions} Questions completed</p>
                        </div>
                    </div >
                </div >);
        })
        return (
            <div >
                <Nav></Nav>
                <div className="Quiz">
                    <div className="row">
                        {rows}
                    </div>
                    <h2 style={{ color: "purple" }}>Choose the number of questions</h2>
                    <form onSubmit={this.quizFunction} className="mt-4">
                        <select className="form-control w-25" style={{ marginLeft: "38%" }} value={this.state.value} onChange={this.handleChange}>
                            {options}
                        </select>
                        <select className="form-control w-25 mt-4" style={{ marginLeft: "38%" }} value={this.state.flashcardPack} onChange={this.handleChangeFCP}>
                            {options1}
                        </select>
                        <div className="mt-4">
                            <input className="text-light buttonL" type="submit" value="Start Quiz" />
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default QuizForm;