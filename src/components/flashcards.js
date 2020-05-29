import React, { Component } from 'react';
import '../App.css';
import { Link } from 'react-router-dom';
import Nav from './custnav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import AudioPlayer from 'react-modular-audio-player';
import playButton from '../images/playButton.png'
import pauseButton from '../images/pauseButton.png'
import playButtonH from '../images/playButtonH.png'
import pauseButtonH from '../images/pauseButtonH.png'
import soundOn from '../images/soundOn.png'
import soundOff from '../images/soundOff.png'

class Flashcard extends Component {
    constructor() {
        super();
        this.deleteRecord = this.deleteRecord.bind(this);
        this.fillForm = this.fillForm.bind(this);
        this.state = {
            data: []
        }
    }

    // redirectToHome = () => {
    //     const { history } = this.props;
    //     if (history) history.push('/UserForm');
    // }

    componentDidMount() {
        this.fetchFlashcards();
    }

    fetchFlashcards = () => {

        let url = 'http://localhost:3001/flashcards/flashcards';

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },

            body: JSON.stringify({
                flashcardPackID: this.props.location.state.flashcardPackID,
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


        let url = 'http://localhost:3001/flashcards/deleteFlashcard';
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                flashcardID: event.target.id,
            })
        }).then((response) => response.json())
            .then((responseJson) => {

                this.fetchFlashcards();

            }).catch((error) => {
                alert('Failed to Save.');
            });
    }

    fillForm = item => event => {
        event.preventDefault();
        this.props.history.push('/flashcardForm', {
            flashcardPackID: this.props.location.state.flashcardPackID, flashcardName: item.FlashcardName, flashcardDescription: item.FlashcardDescription,
            flashcardPackName: this.props.location.state.flashcardPackName, flashcardID: event.target.id,
        });
    }

    fillForm1 = () => event => {
        event.preventDefault();
        this.props.history.push('/flashcardForm', { flashcardPackID: this.props.location.state.flashcardPackID, flashcardPackName: this.props.location.state.flashcardPackName });
    }

    logout = () => event => {
        event.preventDefault();
        localStorage.clear();
        this.props.history.push('/');
    }

    render() {
        let rows = [];

        const contents = this.state.data.forEach((item, key) => {
            let b64 = 0;
            if (item.FlashcardImage !== null) {
                b64 = new Buffer(item.FlashcardImage.data).toString('base64');
            }

            let b641 = 0;
            if (item.FlashcardAudio !== null) {
                b641 = new Buffer(item.FlashcardAudio.data);
            }
            console.log(URL.createObjectURL(new Blob([b641])));

            let audioFile = [
                {
                    src: URL.createObjectURL(new Blob([b641])),
                },
            ];
            rows.push(
                <div className="col-sm-3">
                    <div className="card my-3" style={{ borderRadius: "30px", borderWidth: "0px", boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)" }}>
                        <div ><img style={{ borderTopLeftRadius: "30px", borderTopRightRadius: "30px" }} src={"data:image/*;base64," + b64} className="card-img-top" alt="..." ></img></div>
                        <h5 className="card-header" style={{ color: "purple", backgroundColor: "purple", color: "white" }}>{item.FlashcardName}</h5>
                        {/* <h5 className="card-header transform-title bg-danger" style={{ color: "white" }}>{item.FlashcardName}</h5> */}
                        <div className="card-body">
                            <p className="card-text">{item.FlashcardDescription}</p>
                            {/* <img src={"data:image/png;base64," + b64} className="card-img-top" alt="..."></img> */}
                            {(this.props.location.state.canEdit === undefined) ? <div>
                                <button onClick={this.fillForm(item)} id={item.FlashcardID} className="buttonL mr-1" >Edit</button>
                                <button id={item.FlashcardID} onClick={this.deleteRecord} className="buttonL">Delete</button>
                            </div> : <div></div>}
                            {item.FlashcardAudio === null ?
                                <div>
                                </div>
                                : <div className="mt-3"><AudioPlayer
                                    audioFiles={audioFile}
                                    fontColor="purple"
                                    playerWidth="98%"
                                    fontWeight="bold"
                                    playIcon={playButton}
                                    playHoverIcon={playButtonH}
                                    pauseIcon={pauseButton}
                                    pauseHoverIcon={pauseButtonH}
                                    volumeIcon={soundOn}
                                    volumeEngagedIcon={soundOn}
                                    muteIcon={soundOff}
                                    muteEngagedIcon={soundOff}
                                    sliderClass="purple-player"
                                    hideName
                                    hideRewind
                                    hideForward
                                    hideLoop
                                    hideTime
                                /></div>}
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
                    </div>{
                        (this.props.location.state.canEdit === undefined) ?
                            <button onClick={this.fillForm1()} className="btn addButtonF"><FontAwesomeIcon icon={faPlus} /></button>
                            : <div></div>}
                </div>
            </div>
        );
    }
}

export default Flashcard;