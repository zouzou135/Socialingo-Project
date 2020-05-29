import React, { Component } from 'react';
import '../App.css';
import { FilePond } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import Toggle from 'react-toggle';
import { ReactMic } from 'react-mic';

class FlashcardForm extends Component {

    constructor(props) {
        super(props);
        // This binding is necessary to make `this` work in the callback
        this.FlashcardFunction = this.FlashcardFunction.bind(this);
        this.state = {
            FlashcardName: '', FlashcardDescription: '', FlashcardID: this.props.location.state.flashcardID,
            image: '',
            audio: '',
            isRecord: false,
            record: false,
        }
    }

    componentDidMount() {

    }

    startRecording = () => {
        console.log("start");
        this.setState({
            record: true
        });
    }

    stopRecording = () => {
        this.setState({
            record: false
        });
    }

    onData = (recordedBlob) => {
        console.log('chunk of real-time data is: ', recordedBlob);
    }

    onStop = (recordedBlob) => {
        recordedBlob.blob.arrayBuffer().then(buffer => {
            var buf = Buffer.alloc(buffer.byteLength);
            var view = new Uint8Array(buffer);
            for (var i = 0; i < buf.length; ++i) {
                buf[i] = view[i];
            }
            console.log('recordedBlob is: ', buf);
            this.setState({
                audio: buf
            });
        });

        // let buffer = new Buffer.alloc(recordedBlob.blob.size, recordedBlob.blob);
        // console.log('recordedBlob is: ', buffer);
        // this.setState({
        //     audio: recordedBlob.blob
        // });
    }

    handleFNameChange = event => {
        event.preventDefault();
        this.setState({ FlashcardName: event.target.value });
    }

    handleFDescriptionChange = event => {
        event.preventDefault();
        this.setState({ FlashcardDescription: event.target.value });
    }

    FlashcardFunction = (event) => {

        event.preventDefault();
        const { FlashcardName } = this.state;
        const { FlashcardDescription } = this.state;
        let FlashcardPackID = '';

        let url = '';
        console.log(this.state.audio);
        // console.log(this.props.location.state.flashcardID);
        if (this.props.location.state.flashcardID === undefined) {
            FlashcardPackID = this.props.location.state.flashcardPackID;
            url = 'http://localhost:3001/flashcards/addFlashcard';
        } else {
            // this.state.FlashcardID = this.props.location.state.flashcardID;
            url = 'http://localhost:3001/flashcards/updateFlashcard';
        }

        console.log(this.state.audio);
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                flashcardName: FlashcardName,
                flashcardDescription: FlashcardDescription,
                flashcardPackID: FlashcardPackID,
                flashcardID: this.state.FlashcardID,
                flashcardImage: JSON.parse(this.state.image),
                flashcardAudio: typeof this.state.audio === "string" && this.state.audio !== '' ? JSON.parse(this.state.audio) : this.state.audio,
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson.insertId)
                console.log(responseJson.insertId !== 0)
                console.log(this.pond.props.server.process.headers.id);
                // if (responseJson.insertId !== 0) {
                //     this.state.FlashcardID = responseJson.insertId;
                //     this.pond.props.server.process.headers.id = responseJson.insertId;
                // }
                this.props.history.push('/flashcards', { flashcardPackID: this.props.location.state.flashcardPackID, flashcardPackName: this.props.location.state.flashcardPackName });

            }).catch((error) => {
                alert('Failed to Save.');
            });
    }

    fTable = () => event => {
        event.preventDefault();
        this.props.history.push('/flashcards', { flashcardPackID: this.props.location.state.flashcardPackID, flashcardPackName: this.props.location.state.flashcardPackName });
    }

    handleAudioStatus = (event) => {
        event.preventDefault();
        this.setState({ audio: '' });


        if (!this.state.isRecord) {
            this.setState({ isRecord: true });

        } else {
            this.setState({ isRecord: false });

        }
    }


    render() {

        return (
            <div className="App Contain3">
                <form onSubmit={this.FlashcardFunction} method="POST" className="">
                    <div className="white-text row">
                        <h1>Flashcard Information</h1>
                    </div>
                    <div style={{ marginLeft: "28%" }} className="row">
                        <a onClick={this.fTable()} href=""> Go back to Flashcards </a>
                    </div>
                    <div className="white-text form-group row">
                        <label className="form-label" style={{ fontWeight: "bold" }} htmlFor="fcName">Flashcard Name</label>
                        <input className="form-control" type="text" onChange={this.handleFNameChange} id="FPName" name="FPName" placeholder={(this.props.location.state !== undefined) ? this.props.location.state.flashcardName : 'Flashcard Pack Name'} required size="10" /><br />
                    </div>
                    <div className="form-group row">
                        <label className="white-text form-label" style={{ fontWeight: "bold" }} htmlFor="fcDescription">Flashcard Description</label>
                        <textarea className="form-control animated" type="text" id="FPRating" name="FPRating" onChange={this.handleFDescriptionChange} placeholder={(this.props.location.state !== undefined) ? this.props.location.state.flashcardDescription : 'Flashcard Pack Rating'} required size="10" /><br />
                    </div>
                    <div className="form-group row ml-1">
                        <div className="form-group column" style={{ marginRight: "40px" }}>
                            <div className="row">
                                <label className="form-label white-text" style={{ fontWeight: "bold" }} htmlFor="fcImage">Flashcard Image</label>
                            </div>
                            <div className="row flashcardF">
                                <FilePond required ref={ref => { this.pond = ref }} allowMultiple={false} name={"file"} acceptedFileTypes="image/*" server={{
                                    url: 'http://localhost:3001/flashcards/upload',
                                    process: {
                                        headers: {
                                            id: this.state.FlashcardID
                                        },

                                        onload: (res) => {
                                            console.log(res);
                                            this.setState({ image: res });
                                            // if (res === "Failed") {
                                            //     console.log(this.pond.getFile());
                                            //     alert("Add a flashcard name and then upload again");
                                            //     // this.pond.removeFile();
                                            // }
                                        },
                                    }
                                }} />
                            </div>
                        </div>
                        <div className="form-group column">
                            <div className="row">
                                <label className="form-label white-text" style={{ fontWeight: "bold" }} htmlFor="fcImage">Flashcard Audio</label>
                                <div className="col-xs-4"> <Toggle
                                    className="ml-5"
                                    id='record-status'
                                    checked={this.state.isRecord}
                                    onChange={this.handleAudioStatus}
                                    icons={false}
                                /></div>
                                <label className="font-weight-bold white-text ml-2" htmlFor='record-status'>Record</label>
                            </div>
                            {!this.state.isRecord ?
                                <div className="row flashcardF">
                                    <FilePond ref={ref => { this.pond = ref }} allowMultiple={false} name={"file"} acceptedFileTypes="audio/*" server={{
                                        url: 'http://localhost:3001/flashcards/uploadAudio',
                                        process: {
                                            headers: {
                                                id: this.state.FlashcardID
                                            },

                                            onload: (res) => {
                                                console.log(res);
                                                this.setState({ audio: res });
                                                // if (res === "Failed") {
                                                //     console.log(this.pond.getFile());
                                                //     alert("Add a flashcard name and then upload again");
                                                //     // this.pond.removeFile();
                                                // }
                                            },
                                        }
                                    }} />
                                </div>
                                : <div className="row" >
                                    <ReactMic
                                        width="100%"
                                        record={this.state.record}
                                        onStop={this.onStop}
                                        onData={this.onData}
                                        mimeType="audio/mp3"
                                        strokeColor="#ffffff"
                                        backgroundColor="#ffffff00" />
                                    <button style={{ height: "40px", marginTop: "28px", marginLeft: "5px" }} className="raised" onClick={this.startRecording} type="button">Start</button>
                                    <button style={{ height: "40px", marginTop: "28px", marginLeft: "5px" }} className="raised" onClick={this.stopRecording} type="button">Stop</button>
                                </div>}
                            <div style={{ color: "FIREBRICK", marginTop: "-10px", fontWeight: "bold" }}>(not required)</div>
                        </div>
                    </div>
                    <input className="btn btn-dark raised" style={{ marginTop: "-25px" }} type="submit" value="Save" />
                </form>
            </div>
        );
    }
}

export default FlashcardForm;