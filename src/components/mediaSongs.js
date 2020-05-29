import React, { Component } from 'react';
import '../App.css';
import { Link } from 'react-router-dom';
import Nav from './custnav';
import AudioPlayer from 'react-modular-audio-player';
import playButton from '../images/playButton.png'
import pauseButton from '../images/pauseButton.png'
import playButtonH from '../images/playButtonH.png'
import pauseButtonH from '../images/pauseButtonH.png'
import soundOn from '../images/soundOn.png'
import soundOff from '../images/soundOff.png'

class Songs extends Component {
    constructor() {
        super();
        this.state = {
            Users: [],
            Languages: [],
            Language: '',
            Songs: [],
            SongsInfo: [],
        }
    }

    // redirectToHome = () => {
    //     const { history } = this.props;
    //     if (history) history.push('/UserForm');
    // }

    componentDidMount() {
        this.fetchLanguages();
    }

    fetchLanguages = () => {

        let url = 'http://localhost:3001/suggestion/languagesL';

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
                this.setState({ Language: responseJson[0].LanguageID });
                this.fetchSongs(responseJson[0].LanguageID);
            }).catch((error) => {
                alert(error);
            });
    }

    fetchSongs = (language) => {

        let url = 'http://localhost:3001/suggestion/songs';

        if (this.state.Language !== '') {
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },

                body: JSON.stringify({
                    languageID: language,
                })

            }).then((response) => response.json())
                .then((responseJson) => {
                    console.log(responseJson);
                    this.setState({ Songs: responseJson });
                    let prevResponse = responseJson;

                    for (var j = 0; j < prevResponse.length; j++) {

                        let url = `https://cors-anywhere.herokuapp.com/https://api.deezer.com/track/${prevResponse[j].SongID}`;

                        fetch(url, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                            },

                        }).then((response) => response.json())
                            .then((responseJson) => {
                                console.log(responseJson);
                                this.setState({ SongsInfo: [...this.state.SongsInfo, responseJson] });
                            }).catch((error) => {
                                alert(error);
                            });
                    }

                }).catch((error) => {
                    alert(error);
                });
        }
    }

    handleLanguageChange = event => {
        event.preventDefault();
        this.setState({ SongsInfo: [] });
        this.setState({ Songs: [] });
        this.setState({ Language: event.target.value });
        console.log(event.target);
        this.fetchSongs(event.target.value);
    }

    addSuggestion = (event) => {
        event.preventDefault();
        this.props.history.push('/songForm', {});
    }

    render() {
        let rows = [];

        let options = [];

        const contents = this.state.Languages.forEach((item, key) => {
            options.push(
                <option value={item.LanguageID}>{item.LanguageName}</option>);
        });


        if (this.state.SongsInfo.length !== 0) {
            const contents1 = this.state.SongsInfo.forEach((item, key) => {
                console.log(this.state.SongsInfo);
                let song = [
                    {
                        src: item.preview,
                    },
                ];

                rows.push(
                    <div className="col-sm-3">
                        <div className="card my-2 " style={{ width: "270px", borderRadius: "30px", borderWidth: "0px", boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)" }}>
                            <div ><img style={{ borderTopLeftRadius: "30px", borderTopRightRadius: "30px" }} src={item.album.cover_medium} className="card-img-top" alt="..." ></img></div>
                            <h5 className="card-header" style={{ color: "purple", backgroundColor: "purple", color: "white" }}>{item.title}</h5>
                            <div className="card-body">
                                <p className="card-text" style={{ color: "purple" }}>Artist: {item.artist.name}</p>
                                <AudioPlayer
                                    audioFiles={song}
                                    fontColor="purple"
                                    playerWidth="230px"
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
                                />
                                <div className="mt-3"><a style={{ textDecoration: "none" }} href={item.link} target="_blank" className="font-weight-bold">STREAM ON DEEZER</a></div>
                            </div>
                            <h5 className="card-footer" style={{ color: "purple" }}><a className="font-weight-bold">User Comment: </a>{this.state.Songs !== undefined ? this.state.Songs[key].UserDescription : ""}</h5>
                        </div >
                    </div >);

            });
        }


        return (
            <div>
                <Nav></Nav>
                <div>
                    <ul className="nav nav-pills mt-3 position-absolute" style={{ marginLeft: "36%", borderColor: "purple", borderStyle: "solid", borderRadius: "8px", width: "360px" }} id="pills-tab" role="tablist">
                        <li className="nav-item">
                            <Link className="nav-link" style={{ color: "purple" }} id="pills-home-tab" data-toggle="pill" to="/mediaM" role="tab" aria-controls="pills-home" aria-selected="true">Movies {"&"} Tv</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link active" id="pills-profile-tab" style={{ backgroundColor: "purple" }} data-toggle="pill" to="/mediaS" role="tab" aria-controls="pills-profile" aria-selected="false">Music {"&"} Podcasts</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" id="pills-profile-tab" style={{ color: "purple" }} data-toggle="pill" to="/mediaN" role="tab" aria-controls="pills-profile" aria-selected="false">News</Link>
                        </li>
                    </ul>
                    <input className="buttonL font-weight-bold mt-3" style={{ marginLeft: "87%" }} type="Submit" onClick={this.addSuggestion} value="Add Suggestion" />
                    <div style={{ width: "150px", marginTop: "-38px", marginLeft: "2%", marginBottom: "20px" }}>
                        <select className="form-control col-xs-4" value={this.state.value} onChange={this.handleLanguageChange} required>
                            {options}
                        </select>
                    </div>
                </div>
                <div className="row mx-2">
                    {rows}
                </div>
            </div >
        );
    }
}

export default Songs;