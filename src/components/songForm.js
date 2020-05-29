import React, { Component } from 'react';
import '../App.css';
import AudioPlayer from 'react-modular-audio-player';
import playButton from '../images/playButton.png'
import pauseButton from '../images/pauseButton.png'
import playButtonH from '../images/playButtonH.png'
import pauseButtonH from '../images/pauseButtonH.png'
import soundOn from '../images/soundOn.png'
import soundOff from '../images/soundOff.png'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faComment } from '@fortawesome/free-solid-svg-icons';
// import { faFilm } from '@fortawesome/free-solid-svg-icons';
// import { faCheck } from '@fortawesome/free-solid-svg-icons';

class SongForm extends Component {
    constructor(props) {
        super(props);
        // This binding is necessary to make `this` work in the callback
        this.submitFunction = this.submitFunction.bind(this);
        this.state = {
            SongName: '', Language: '',
            Languages: [],
            Song: [],
            SelectedKey: '',
            Description: '',
        }
        this.popup = null;
    }

    componentDidMount() {
        this.fetchLanguages();
    }

    handleSearchChange = event => {
        event.preventDefault();
        this.setState({ SongName: event.target.value.replace(/\s/g, '%20') });

        let url = `https://cors-anywhere.herokuapp.com/https://api.deezer.com/search/track?q=${event.target.value.replace(/\s/g, '%20')}&limit=10`;

        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },

        }).then((response) => response.json())
            .then((responseJson) => {
                this.setState({ Song: responseJson });
                // console.log(responseJson);
                // for (var i = 0; i < responseJson.length; i++) {
                //     this.setState({ SelectedReadMore: [...this.state.SelectedReadMore, false] });
                // }
            }).catch((error) => {
                alert(error);
            });
    }

    handleLanguageChange = event => {
        event.preventDefault();
        this.setState({ Language: event.target.value });
    }

    handleDescriptionChange = event => {
        event.preventDefault();
        this.setState({ Description: event.target.value });
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


    submitFunction = (event) => {
        event.preventDefault();
        let url = 'http://localhost:3001/suggestion/insertSong';

        var languageID = "";

        for (let i = 0; i < this.state.Languages.length; i++) {
            if (this.state.Languages[i].LanguageCode === this.state.Language) {
                languageID = this.state.Languages[i].LanguageID;
            }
        }

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },

            body: JSON.stringify({
                userID: localStorage.getItem("id"),
                songID: this.state.Song.data[this.state.SelectedKey].id,
                songLanguage: languageID,
                userDescription: this.state.Description,
            })

        }).then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                this.props.history.push('/mediaS', {});
            }).catch((error) => {
                alert(error);
            });
    }

    selectSong = (event) => {
        event.preventDefault();
        this.setState({ SelectedKey: parseInt(event.target.id, 10) });
    }

    render() {

        let options = [];

        const contents = this.state.Languages.forEach((item, key) => {
            options.push(
                <option value={item.LanguageCode}>{item.LanguageName}</option>);
        });

        var isHidden = true;

        if (this.state.Language !== '') {
            isHidden = false
        }

        let rows = [];

        var searchClass = "form-control w-50";
        if (this.state.SelectedKey === '' && this.state.SongName !== '') {
            searchClass = "form-control w-50 is-invalid";
        }


        console.log(this.state.Song);

        if (this.state.Song.length !== 0 && this.state.Song.data !== undefined) {
            const contents1 = this.state.Song.data.forEach((item, key) => {
                var bgColor = "", textColor = "purple", borderColor = "";
                console.log(key, this.state.SelectedKey);
                if (this.state.SelectedKey === key && this.state.SelectedKey !== "") {
                    bgColor = "purple";
                    textColor = "white";
                    borderColor = "purple";
                }

                let song = [
                    {
                        src: item.preview,
                    },
                ];

                rows.push(
                    <div className="col-sm-4">
                        <div className="card my-2" style={{ width: "270px", borderColor: borderColor }}>
                            <div style={{ transform: "rotate(0)" }} ><a id={key} className="stretched-link" href="" onClick={this.selectSong}></a><img src={item.album.cover_medium} className="card-img-top" alt="..." ></img></div>
                            <h5 className="card-header" style={{ backgroundColor: bgColor, transform: "rotate(0)" }}><a id={key} style={{ color: textColor, textDecoration: "none" }} className="stretched-link" href="" onClick={this.selectSong}>{item.title}</a></h5>
                            <div className="card-body">
                                <p className="card-text" style={{ color: "purple" }}><a className="font-weight-bold">Artist:</a> {item.artist.name}</p>
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
                            </div>
                        </div >
                    </div >);

            });
        }

        return (

            <div>
                <div className="suggest-page">
                    <form onSubmit={this.submitFunction} method="POST" className="">
                        <div>
                            <h3 className="font-weight-bold" style={{ color: "purple" }}>Suggest A Song</h3>
                        </div>
                        <div className="form-group ">
                            <select className="form-control w-50" value={this.state.value} onChange={this.handleLanguageChange} required>
                                <option value="" selected disabled hidden>Language</option>
                                {options}
                            </select>
                        </div>
                        <div className="form-group ">
                            <input className={searchClass} type="text" onChange={this.handleSearchChange} name="movieSearch" id="movieSearch" placeholder="Search..." hidden={isHidden} required />
                            <span className='invalid-feedback'>Select a Song</span>
                        </div>
                        <div className="form-group">
                            <textarea className="form-control animated w-50" type="text" onChange={this.handleDescriptionChange} name="description" id="description" placeholder="Comment" hidden={isHidden} required />
                            {/* <span className='invalid-feedback'>{this.state.errors.email}</span> */}
                        </div>
                        <input className="buttonL font-weight-bold" type="Submit" value="Submit" />
                    </form>
                </div>
                <div style={{ marginLeft: "35%", marginTop: "-30%" }}>
                    <div className="row mx-2">
                        {rows}
                    </div>
                </div>
            </div>

        );
    }
}

export default SongForm;