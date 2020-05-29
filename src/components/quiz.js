import React, { Component } from 'react';
import '../App.css';
import { Link } from 'react-router-dom';
import Nav from './custnav';

class Quiz extends Component {

    constructor(props) {
        super(props);
        // This binding is necessary to make `this` work in the callback
        this.nextFunction = this.nextFunction.bind(this);
        this.state = {
            selectedOption: 1, numberOfQuestions: this.props.location.state.numberOfQuestions, flashcards: this.props.location.state.flashcards, flashcardPackID: this.props.location.state.flashcardPackID
            , flashcardQuestion: "", answerArray: ['', '', '', ''], rightAnswerI: '', rightAnswerCount: 0, questionCount: 0, imageOnly: false,
        }
    }

    componentDidMount() {
        // console.log(this.state.numberOfQuestions);
        // console.log(this.state.flashcards);
        console.log(this.props.location.state)

        if (this.props.location.state.quizID === undefined) {
            var flashcardQuestionI = Math.floor(Math.random() * this.state.flashcards.length);

            this.setState({ flashcardQuestion: this.state.flashcards[flashcardQuestionI] });
            this.checkIfImageOnly(this.state.flashcards[flashcardQuestionI]);

            let flashcardDescriptions = [];
            for (var i = 0; i < this.state.flashcards.length; i++) {
                flashcardDescriptions.push(this.state.flashcards[i].FlashcardDescription)
            }

            this.state.rightAnswerI = Math.floor(Math.random() * 4);
            this.state.answerArray[this.state.rightAnswerI] = flashcardDescriptions[flashcardQuestionI];
            var temp = flashcardDescriptions[flashcardQuestionI];
            flashcardDescriptions[flashcardQuestionI] = flashcardDescriptions[0];
            flashcardDescriptions[0] = temp;

            let j = 1;
            for (var i = 0; i < 4; i++) {
                if (this.state.answerArray[i] === '') {
                    var random = Math.floor(Math.random() * (this.state.flashcards.length - j) + j);
                    this.state.answerArray[i] = flashcardDescriptions[random];
                    temp = flashcardDescriptions[random];
                    flashcardDescriptions[random] = flashcardDescriptions[j];
                    flashcardDescriptions[j] = temp;
                    j++;
                }
            }
            this.state.questionCount++;
        } else {
            this.state.numberOfQuestions = this.props.location.state.numberOfQuestions;
            this.state.questionCount = this.props.location.state.questionsComleted;
            this.state.rightAnswerCount = this.props.location.state.rightAnswer;

            let url = 'http://localhost:3001/flashcards/questions';

            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },

                body: JSON.stringify({
                    quizID: this.props.location.state.quizID,
                })

            }).then((response) => response.json())
                .then((responseJson) => {
                    console.log(responseJson[0].Question);
                    this.state.answerArray[0] = responseJson[0].QuestionChoice1;
                    this.state.answerArray[1] = responseJson[0].QuestionChoice2;
                    this.state.answerArray[2] = responseJson[0].QuestionChoice3;
                    this.state.answerArray[3] = responseJson[0].QuestionChoice4;
                    this.setState({ rightAnswerI: responseJson[0].Answer });
                    for (let i = 0; i < this.props.location.state.flashcards.length; i++) {
                        if (responseJson[0].Question === this.state.flashcards[i].FlashcardID) {
                            this.setState({ flashcardQuestion: this.state.flashcards[i] });
                            this.checkIfImageOnly(this.state.flashcards[i]);
                        }
                    }

                }).catch((error) => {
                    alert(error);
                });
        }
        console.log(this.state.answerArray);
        console.log(this.state.numberOfQuestions + " " + this.state.questionCount);
    }

    checkIfImageOnly = (flashcardQuestion) => {
        let url = 'http://localhost:3001/flashcards/checkIfImageOnly';
        console.log(flashcardQuestion);
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },

            body: JSON.stringify({
                FCPID: flashcardQuestion.FlashcardPackID,
            })

        }).then((response) => response.json())
            .then((responseJson) => {
                this.setState({ imageOnly: responseJson[0] });
                console.log(responseJson[0]);

            }).catch((error) => {
                alert(error);
            });
    }

    nextFunction = (event) => {

        event.preventDefault();
        if (this.state.selectedOption == (this.state.rightAnswerI + 1)) {
            this.state.rightAnswerCount++;
        }

        this.setState({ selectedOption: 1 });
        this.state.answerArray = ['', '', '', ''];

        var flashcardQuestionI = Math.floor(Math.random() * this.state.flashcards.length);

        this.setState({ flashcardQuestion: this.state.flashcards[flashcardQuestionI] });

        let flashcardDescriptions = [];
        for (var i = 0; i < this.state.flashcards.length; i++) {
            flashcardDescriptions.push(this.state.flashcards[i].FlashcardDescription)
        }

        this.state.rightAnswerI = Math.floor(Math.random() * 4);
        this.state.answerArray[this.state.rightAnswerI] = flashcardDescriptions[flashcardQuestionI];
        var temp = flashcardDescriptions[flashcardQuestionI];
        flashcardDescriptions[flashcardQuestionI] = flashcardDescriptions[0];
        flashcardDescriptions[0] = temp;

        let j = 1;
        for (var i = 0; i < 4; i++) {
            if (this.state.answerArray[i] === '') {
                var random = Math.floor(Math.random() * (this.state.flashcards.length - j) + j);
                this.state.answerArray[i] = flashcardDescriptions[random];
                temp = flashcardDescriptions[random];
                flashcardDescriptions[random] = flashcardDescriptions[j];
                flashcardDescriptions[j] = temp;
                j++;
            }
        }
        this.state.questionCount++;
        // console.log(this.state.questionCount, this.state.numberOfQuestions);

        if ((this.state.questionCount > this.state.numberOfQuestions) && this.props.location.state.quizID !== undefined) {
            let url = 'http://localhost:3001/flashcards/deleteQuiz';

            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },

                body: JSON.stringify({
                    quizID: this.props.location.state.quizID,
                })

            }).then((response) => response.json())
                .then((responseJson) => {

                }).catch((error) => {
                    alert(error);
                });
        }
        this.checkIfImageOnly(this.state.flashcards[flashcardQuestionI]);
        console.log(this.state.imageOnly);
    }


    handleOptionChange = (event) => {
        event.preventDefault();
        this.setState({
            selectedOption: parseInt(event.target.id, 10)
        });
    }

    logout = () => event => {
        event.preventDefault();
        localStorage.clear();
        this.props.history.push('/');
    }

    save = () => event => {
        event.preventDefault();
        let url = 'http://localhost:3001/flashcards/saveQuiz';
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userID: localStorage.getItem("id"),
                numberOfQuestions: this.state.numberOfQuestions,
                question: this.state.flashcardQuestion,
                answerArray: this.state.answerArray,
                rightAnswerCount: this.state.rightAnswerCount,
                rightAnswer: this.state.rightAnswerI,
                questionCount: this.state.questionCount,
                flashcardPackID: this.state.flashcardPackID,
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                // if (responseJson.length < 4) {
                //     alert("You need to have at least 4 flashcards")
                // } else {
                //     this.props.history.push('/quizForm', { flashcards: responseJson });
                // }

            }).catch((error) => {
                alert('Failed to Save.');
            });
        this.props.history.push('/quizForm', {});
    }

    quizForm = () => {
        this.props.history.push('/quizForm', {});
    }

    render() {
        let b64 = 0;
        if (this.state.flashcardQuestion !== '') {
            if (this.state.flashcardQuestion.FlashcardImage !== null) {
                b64 = new Buffer(this.state.flashcardQuestion.FlashcardImage.data).toString('base64');
            }
        }
        var nextOrFinish = 'Next';

        if (this.state.numberOfQuestions <= this.state.questionCount) {
            nextOrFinish = 'Finish';
        }

        return (
            <div>
                <Nav></Nav>
                {
                    (this.state.questionCount <= this.state.numberOfQuestions) ?
                        <div>
                            <button type="button" className="raised save-btn" onClick={this.save()} >save</button>
                            <div style={{ marginTop: "-2%" }} className="Quiz">
                                <h2 style={{ color: "purple" }}>Select the description corresponding to this image</h2>
                                <img src={"data:image/png;base64," + b64} className="" alt="..." width="300" height="300"></img>
                                {
                                    this.state.imageOnly.ImageOnly ?
                                        <div></div>
                                        :
                                        <div style={{ color: "purple" }}>{this.state.flashcardQuestion.FlashcardName}</div>
                                }
                            </div>
                            <form onSubmit={this.nextFunction} className="mt-3">
                                <div className="radioBtns" >
                                    <div className="row">
                                        <div className="card my-1" >
                                            <div className="card-body" style={this.state.selectedOption === 1 ? { backgroundColor: "purple", color: "white" } : {}}>
                                                <a href="" class="stretched-link" id={1} name={this.state.answerArray[0]} onClick={this.handleOptionChange}></a>
                                                <p className="card-text font-weight-bold" style={{ textAlign: "center" }}>{this.state.answerArray[0]}</p>
                                            </div>
                                        </div >
                                    </div >

                                    <div className="row">
                                        <div className="card my-1" >
                                            <div className="card-body" style={this.state.selectedOption === 2 ? { backgroundColor: "purple", color: "white" } : {}}>
                                                <a href="" class="stretched-link" id={2} name={this.state.answerArray[0]} onClick={this.handleOptionChange}></a>
                                                <p className="card-text font-weight-bold" style={{ textAlign: "center" }}>{this.state.answerArray[1]}</p>
                                            </div>
                                        </div >
                                    </div >

                                    <div className="row">
                                        <div className="card my-1" >
                                            <div className="card-body" style={this.state.selectedOption === 3 ? { backgroundColor: "purple", color: "white" } : {}}>
                                                <a href="" class="stretched-link" id={3} name={this.state.answerArray[0]} onClick={this.handleOptionChange}></a>
                                                <p className="card-text font-weight-bold" style={{ textAlign: "center" }}>{this.state.answerArray[2]}</p>
                                            </div>
                                        </div >
                                    </div >

                                    <div className="row">
                                        <div className="card mt-1" >
                                            <div className="card-body" style={this.state.selectedOption === 4 ? { backgroundColor: "purple", color: "white" } : {}}>
                                                <a href="" class="stretched-link" id={4} name={this.state.answerArray[0]} onClick={this.handleOptionChange}></a>
                                                <p className="card-text font-weight-bold" style={{ textAlign: "center" }}>{this.state.answerArray[3]}</p>
                                            </div>
                                        </div >
                                    </div >
                                    {/* <div className="radio" >
                                        <label>
                                            <input className="mr-2" type="radio" value={1}
                                                checked={this.state.selectedOption == 1}
                                                onChange={this.handleOptionChange} />
                                            {this.state.answerArray[0]}
                                        </label>
                                    </div>
                                    <div className="radio">
                                        <label>
                                            <input className="mr-2" type="radio" value={2}
                                                checked={this.state.selectedOption == 2}
                                                onChange={this.handleOptionChange} />
                                            {this.state.answerArray[1]}
                                        </label>
                                    </div>
                                    <div className="radio">
                                        <label>
                                            <input className="mr-2" type="radio" value={3}
                                                checked={this.state.selectedOption == 3}
                                                onChange={this.handleOptionChange} />
                                            {this.state.answerArray[2]}
                                        </label>
                                    </div>
                                    <div className="radio">
                                        <label>
                                            <input className="mr-2" type="radio" value={4}
                                                checked={this.state.selectedOption == 4}
                                                onChange={this.handleOptionChange} />
                                            {this.state.answerArray[3]}
                                        </label>
                                    </div> */}
                                </div>
                                <div className="Quiz mb-3">
                                    <input className="buttonL text-light" type="submit" value={nextOrFinish} />
                                </div>
                            </form>
                        </div>
                        : <div><div style={{ borderRadius: "30px" }} className="Contain App white-text"><h2>Your Score is:
                              {this.state.rightAnswerCount}/{this.state.numberOfQuestions}</h2>
                        </div>< button style={{ marginLeft: "47%" }} className="buttonL text-light mt-3" type="submit" onClick={this.quizForm}>Quiz Page</button></div>
                }
            </div>
        );
    }
}

export default Quiz;