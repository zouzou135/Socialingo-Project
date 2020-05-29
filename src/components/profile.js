import React, { Component } from 'react';
import { ChatManager, TokenProvider } from '@pusher/chatkit-client'
import '../App.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentAlt } from '@fortawesome/free-solid-svg-icons';
import { faPollH } from '@fortawesome/free-solid-svg-icons';
import { faTv } from '@fortawesome/free-solid-svg-icons';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import playButton from '../images/playButton.png'
import pauseButton from '../images/pauseButton.png'
import playButtonH from '../images/playButtonH.png'
import pauseButtonH from '../images/pauseButtonH.png'
import soundOn from '../images/soundOn.png'
import soundOff from '../images/soundOff.png'

import YouTube from 'react-youtube';
import Nav from './custnav';
import AudioPlayer from 'react-modular-audio-player';

import Posts from "./PostTab";

class Profile extends Component {
    constructor() {
        super();
        this.state = {
            data: [],
            ProfilePicture: '',
            User: '',
            activeTab: "Posts",
            Movies: [],
            MovieInfo: [],
            clickedMovieI: '',
            isHidden: true,
            isHInfo: true,
            trailerCode: '',
            imdLink: '',
            Songs: [],
            SongsInfo: [],
            data: [],
            notMaker: [],
        }
        this.playerRef = React.createRef();
    }

    // redirectToHome = () => {
    //     const { history } = this.props;
    //     if (history) history.push('/UserForm');
    // }

    UpdateUserPosts = async (posts) => {
        try {
            this.setState({ posts });
        } catch (error) {
            console.error(error);
        }
    };

    componentDidMount() {
        this.fetchUser();
        this.fetchProfilePicture();
        const chatManager = new ChatManager({
            instanceLocator: 'v1:us1:20385da1-b0ee-4951-94b1-300764c60052',
            userId: localStorage.getItem("username"),
            tokenProvider: new TokenProvider({ url: 'https://us1.pusherplatform.io/services/chatkit_token_provider/v1/20385da1-b0ee-4951-94b1-300764c60052/token' })
        })

        chatManager
            .connect()
            .then(currentUser => {
                console.log("Connected as user ", currentUser);

                currentUser.enablePushNotifications()
                    .then(() => {
                        console.log('Push Notifications enabled');
                    })
                    .catch(error => {
                        console.error("Push Notifications error:", error);
                    });

                // Do other great things afterwards ✨
            })
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

    fetchProfilePicture = () => {
        let url = 'http://localhost:3001/profile/picture';

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
                console.log(responseJson);
                if (responseJson.ProfilePicture !== null) {
                    this.setState({ ProfilePicture: responseJson.ProfilePicture.data });
                }
            }).catch((error) => {
                alert(error);
            });
    }

    fetchUser = () => {

        let url = 'http://localhost:3001/profile';

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
                console.log(responseJson);
                this.setState({ User: responseJson });
            }).catch((error) => {
                alert(error);
            });
    }

    postsTab = (event) => {
        event.preventDefault();
        this.setState({ activeTab: "Posts" });

    }

    moviesTab = (event) => {
        event.preventDefault();
        this.setState({ activeTab: "Movies" });

        if (this.state.Movies.length === 0) {
            let url = 'http://localhost:3001/profile/movies';

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
                    console.log(responseJson);
                    this.setState({ Movies: responseJson });
                    let prevResponse = responseJson;

                    var api_key = 'f41e8dda582116a9ae5b0d01d10de92a';

                    let url;

                    for (var j = 0; j < prevResponse.length; j++) {
                        let langCode = '';
                        for (var z = 0; z < this.state.User.knownLang.length; z++) {
                            if (this.state.User.knownLang[z].LanguageID === prevResponse[j].MLanguageID) {
                                langCode = this.state.User.knownLang[z].LanguageCode;
                            }
                        }

                        for (var i = 0; i < this.state.User.langToLearn.length; i++) {
                            if (this.state.User.langToLearn[i].LanguageID === prevResponse[j].MLanguageID) {
                                langCode = this.state.User.langToLearn[i].LanguageCode;
                            }
                        }

                        console.log(prevResponse[j].MLanguageID);

                        console.log(prevResponse[j].Type);
                        if (prevResponse[j].Type === "tv") {
                            url = `https://api.themoviedb.org/3/tv/${prevResponse[j].MovieID}?api_key=${api_key}`;
                        } else {
                            url = `https://api.themoviedb.org/3/movie/${prevResponse[j].MovieID}?api_key=${api_key}`;
                        }


                        fetch(url, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                            },

                        }).then((response) => response.json())
                            .then((responseJson) => {
                                console.log(responseJson);
                                this.setState({ MovieInfo: [...this.state.MovieInfo, responseJson] });
                                console.log(this.state.MovieInfo);
                            }).catch((error) => {
                                alert(error);
                            });
                    }

                }).catch((error) => {
                    alert(error);
                });
        }
    }

    handleHover = (event) => {
        event.preventDefault();
        this.setState({ isHidden: false });
        // console.log(event.target);
        this.setState({ clickedMovieI: parseInt(event.target.id, 10) });
        this.setState({ isHInfo: true });
    }

    handleClose = (event) => {
        event.preventDefault();
        this.setState({ isHidden: true });
        // console.log(event.target);
        this.setState({ isHInfo: true });
        this.playerRef.current.internalPlayer.stopVideo();
    }

    handleHoverOut = (event) => {
        event.preventDefault();
        this.setState({ isHidden: true });
        // console.log(event.target);
        // this.setState({ clickedMovieI: '' });
        console.log(this.playerRef.current);
        this.playerRef.current.internalPlayer.stopVideo();
    }

    handleArrowClick = (event) => {
        event.preventDefault();
        this.setState({ isHInfo: false });
        if (this.state.Movies[this.state.clickedMovieI].Type === "tv") {
            // console.log(this.state.Language);
            this.fetchTrailer(`https://api.themoviedb.org/3/tv/${this.state.Movies[this.state.clickedMovieI].MovieID}/videos?api_key=f41e8dda582116a9ae5b0d01d10de92a&Language=${this.state.LanguageCode}`);
            this.fetchIMD(`https://api.themoviedb.org/3/tv/${this.state.Movies[this.state.clickedMovieI].MovieID}/external_ids?api_key=f41e8dda582116a9ae5b0d01d10de92a`);
        } else {
            this.fetchTrailer(`https://api.themoviedb.org/3/movie/${this.state.Movies[this.state.clickedMovieI].MovieID}/videos?api_key=f41e8dda582116a9ae5b0d01d10de92a&Language=${this.state.LanguageCode}`);
            this.fetchIMD(`https://api.themoviedb.org/3/movie/${this.state.Movies[this.state.clickedMovieI].MovieID}/external_ids?api_key=f41e8dda582116a9ae5b0d01d10de92a`)
        }
    }

    fetchIMD = (url) => {
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },

        }).then((response) => response.json())
            .then((responseJson) => {
                // console.log(responseJson);
                this.setState({ imdLink: "https://www.imdb.com/title/" + responseJson.imdb_id });
            }).catch((error) => {
                alert(error);
            });
    }

    fetchTrailer = (url) => {
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },

        }).then((response) => response.json())
            .then((responseJson) => {
                // console.log(responseJson);
                for (var i = 0; i < responseJson.results.length; i++) {
                    // console.log(responseJson.results[i].type);
                    if (responseJson.results[i].type === "Trailer")
                        this.setState({ trailerCode: responseJson.results[i].key });
                }
            }).catch((error) => {
                alert(error);
            });
    }


    songsTab = (event) => {
        event.preventDefault();
        this.setState({ activeTab: "Songs" });

        if (this.state.Songs.length === 0) {
            let url = 'http://localhost:3001/profile/songs';

            if (this.state.Language !== '') {
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

    }

    flashcardsTab = (event) => {
        event.preventDefault();
        this.setState({ activeTab: "Flashcards" });
        this.checkIfMaker();
        this.fetchUsers();
    }

    // fillForm = item => event => {
    //     event.preventDefault();
    //     this.props.history.push('/flashcardForm', {
    //         flashcardPackID: this.props.location.state.flashcardPackID, flashcardName: item.FlashcardName, flashcardDescription: item.FlashcardDescription,
    //         flashcardPackName: this.props.location.state.flashcardPackName, flashcardID: event.target.id,
    //     });
    // }

    // fillForm1 = () => event => {
    //     event.preventDefault();
    //     this.props.history.push('/flashcardForm', { flashcardPackID: this.props.location.state.flashcardPackID, flashcardPackName: this.props.location.state.flashcardPackName });
    // }

    logout = () => event => {
        event.preventDefault();
        localStorage.clear();
        this.props.history.push('/');
    }

    render() {
        const opts = {
            height: '350',
            width: '120%',
            playerVars: { // https://developers.google.com/youtube/player_parameters
                autoplay: 0
            }
        };
        let rows = [];
        let b64 = 0;
        let profPic = require('../images/DefaultPP.png');
        let languagesKnown = '';
        let languagesToLearn = '';
        let country = '';
        if (this.state.ProfilePicture !== '' && this.state.ProfilePicture !== null) {
            b64 = new Buffer(this.state.ProfilePicture).toString('base64');
            profPic = "data:image/png;base64," + b64;
        }

        if (this.state.User !== '') {
            country = this.state.User.user.UserCountry;
            for (var i = 0; i < this.state.User.knownLang.length; i++) {
                languagesKnown += this.state.User.knownLang[i].LanguageName;
                if (i !== this.state.User.knownLang.length - 1) {
                    languagesKnown += ", ";
                }
                else {
                    languagesKnown += ".";
                }
            }

            for (var j = 0; j < this.state.User.langToLearn.length; j++) {
                languagesToLearn += this.state.User.langToLearn[j].LanguageName;
                if (j !== this.state.User.langToLearn.length - 1) {
                    languagesToLearn += ", ";
                }
                else {
                    languagesToLearn += ".";
                }
            }

        }


        let tabsClasses = [];
        let GRows = [];

        if (this.state.activeTab === "Posts") {
            tabsClasses = ["nav-link active", "nav-link", "nav-link", "nav-link"];


        } else if (this.state.activeTab === "Movies") {
            tabsClasses = ["nav-link", "nav-link active", "nav-link", "nav-link"];
            let columns = [];

            const contents1 = this.state.MovieInfo.forEach((item, key) => {
                // for (var j = 0; j < this.state.MovieInfo.length / 5; j++) {
                if (this.state.MovieInfo !== []) {

                    let hide = true;
                    // let marginT = '40%';
                    // console.log(key, this.state.clickedMovieI)
                    if (key === this.state.clickedMovieI && !this.state.isHidden) {
                        hide = false;
                        // marginT = '28%';
                    }
                    if (key % 5 === 0) {
                        rows = [];
                    }
                    if (this.state.Movies[key].Type === 'tv') {
                        rows.push(
                            // <div className="col-sm-3">
                            <div className="card my-3 bg-dark text-white item" style={{ boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)" }} onMouseEnter={this.handleHover} onMouseLeave={this.handleHoverOut} id={key}>
                                <img className="card-img" id={key} src={"https://image.tmdb.org/t/p/original" + item.backdrop_path} alt="Card image"></img>
                                <div className="card-img-overlay" id={key}>
                                    <h3 className="card-title" id={key} style={{ textShadow: "2px 2px 2px #aaa", bottom: "0px", position: "absolute", width: "84%", textAlign: "center" }}>{item.name}
                                        <div hidden={hide} onClick={this.handleArrowClick}><FontAwesomeIcon icon={faArrowDown} style={{ color: "white" }}></FontAwesomeIcon></div>
                                    </h3>
                                </div>
                            </div>

                            // </div>
                        );
                    } else {
                        rows.push(
                            // <div className="col-sm-3">
                            <div className="card my-3 bg-dark text-white item" style={{ boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)" }} onMouseEnter={this.handleHover} onMouseLeave={this.handleHoverOut} id={key}>
                                <img className="card-img" id={key} src={"https://image.tmdb.org/t/p/original" + item.backdrop_path} alt="Card image"></img>
                                <div className="card-img-overlay" id={key}>
                                    <h3 className="card-title" id={key} style={{ textShadow: "2px 2px 2px #aaa", bottom: "0px", position: "absolute", width: "84%", textAlign: "center" }}>{item.title}
                                        <div hidden={hide} onClick={this.handleArrowClick}><FontAwesomeIcon icon={faArrowDown} style={{ color: "white" }}></FontAwesomeIcon></div>
                                    </h3>
                                    {/* <p className="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                                                    <p className="card-text">Last updated 3 mins ago</p> */}
                                </div>
                            </div>
                            // </div>
                        );
                    }


                }
                let mOverview = '', comment = '', homepage = '', type = '', info = '';
                if (this.state.clickedMovieI !== '') {
                    mOverview = this.state.MovieInfo[this.state.clickedMovieI].overview;
                    comment = this.state.Movies[this.state.clickedMovieI].UserDescription;
                    homepage = this.state.MovieInfo[this.state.clickedMovieI].homepage;
                    if (this.state.Movies[this.state.clickedMovieI].Type === "tv") {
                        type = "TV Show";

                    } else {
                        type = "Movie";
                    }
                }

                console.log(Math.floor(this.state.clickedMovieI / this.state.Movies.length), Math.floor(key / 5))
                console.log(Math.floor(key / 5))
                let rowShow = true;
                if (Math.floor(this.state.clickedMovieI / this.state.Movies.length) === key / 5) {
                    rowShow = false;
                }

                if (key % 5 === 0) {
                    columns.push(
                        <div>
                            <div className="item-container">
                                {rows}
                            </div>
                            <div>
                                <div className="content" hidden={this.state.isHInfo || rowShow} style={{ marginTop: "-13px" }}>
                                    <div className="backgroundM">
                                        <div className="left">
                                            <YouTube ref={this.playerRef}
                                                opts={opts}
                                                videoId={this.state.trailerCode}
                                                onReady={this._onReady}
                                            />
                                        </div>
                                        <div className="right" style={{ color: "white" }}>
                                            <h2 style={{ marginLeft: "170px" }}>Overview<a href="" onClick={this.handleClose} style={{ marginLeft: "81%" }} ><FontAwesomeIcon icon={faTimes} style={{ color: "white" }}> </FontAwesomeIcon></a></h2>
                                            <h5 style={{ marginLeft: "170px", marginTop: "30px" }}>{mOverview}</h5>
                                            <h5 style={{ marginLeft: "170px", marginTop: "30px" }}><a className="font-weight-bold">User Comment:</a> {comment}</h5>
                                            <h5 style={{ marginLeft: "170px" }}><a className="font-weight-bold">Type:</a> {type}</h5>
                                            <h5 style={{ marginLeft: "170px", bottom: "0px", position: "absolute" }}>
                                                <a style={{ width: "50%", textDecoration: "none" }} href={homepage} target="_blank" className="font-weight-bold mr-5">Home Page</a>
                                                <a style={{ width: "50%", textDecoration: "none" }} href={this.state.imdLink} target="_blank" className="font-weight-bold">IMDB</a>
                                            </h5>
                                        </div>
                                    </div>
                                    <div style={{ marginLeft: "-30px", marginTop: "-30px" }} class="content-container">

                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }
            });
            // }

            GRows = columns;
            console.log(columns)
        } else if (this.state.activeTab === "Songs") {
            tabsClasses = ["nav-link", "nav-link", "nav-link active", "nav-link"];

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
                                <h5 className="card-footer" style={{ color: "purple" }}><a className="font-weight-bold">User Comment: </a>{this.state.Songs[key].UserDescription}</h5>
                            </div >
                        </div >);
                    GRows = [<div className="row mx-2">{rows}</div>];
                });
            }
        } else {
            tabsClasses = ["nav-link", "nav-link", "nav-link", "nav-link active"];
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
                                        <button onClick={this.fillForm(item)} className="buttonL mr-1" >Edit</button>
                                        <button id={item.FlashcardPackID} onClick={this.deleteRecord} className="buttonL">Delete</button>
                                    </div>
                                    : <button onClick={this.removeButton(item)} className="buttonL mr-1" >Remove</button>}
                            </div>
                        </div >
                    </div >);
            });
            GRows = [<div className="container"><div className="row">{rows}</div> <button onClick={this.fillForm1()} className="btn addButtonF"><FontAwesomeIcon icon={faPlus} /></button></div>];
        }

        // const contents = this.state.data.forEach((item, key) => {
        //     var isMaker = true;
        //     for (let i = 0; i < this.state.notMaker.length; i++) {
        //         if (item.FlashcardPackID === this.state.notMaker[i]) {
        //             isMaker = false;
        //         }
        //     }
        //     rows.push(
        //         <div className="col-sm-3">
        //             <div className="card my-3" style={{ borderRadius: "30px", borderWidth: "0px", boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)" }}>
        //                 <h5 className="card-header" style={{ transform: "rotate(0)", color: "purple", backgroundColor: "purple", borderTopLeftRadius: "30px", borderTopRightRadius: "30px" }} ><a href="" class="stretched-link" id={item.FlashcardPackID} name={item.FlashcardPackName} style={{ textDecoration: "none", color: "white" }} onClick={this.flashcard()}>{item.FlashcardPackName}</a></h5>
        //                 <div className="card-body">
        //                     <p className="card-text">{item.FlashcardPackDescription}</p>
        //                     {isMaker ?
        //                         <div>
        //                             <button onClick={this.fillForm(item)} className="btn btn-secondary raised mr-1" >Edit</button>
        //                             <button id={item.FlashcardPackID} onClick={this.deleteRecord} className="btn btn-secondary raised">Delete</button>
        //                         </div>
        //                         : <button onClick={this.removeButton(item)} className="btn btn-secondary raised mr-1" >Remove</button>}
        //                 </div>
        //             </div >
        //         </div >);
        // });
        return (
            <div>
                <Nav></Nav>

                <div className="profileContainer Contain" style={{ marginBottom: "3px", marginTop: "1%", position: "relative" }}>
                    <img src={profPic} alt="Avatar" className="profilePic mr-2"></img>
                    <a className="navbar-brand font-weight-bold">{localStorage.getItem("username")}</a>
                    <div className="textInProfile ml-3">
                        <div className=" mt-3">Country: {country}</div>
                        <div>Fluent in: {languagesKnown}</div>
                        <div>Learning: {languagesToLearn}</div>
                    </div>
                    <div className="navbar-default">
                        <ul className="nav nav-tabs" style={{ width: '80%', marginLeft: "27%", bottom: "0px", borderBottom: "0px", position: "absolute", borderColor: "rgb(75, 57, 92)" }}>
                            <li className="nav-item" style={{ marginRight: '5%' }} >
                                <a className={tabsClasses[0]} href="" onClick={this.postsTab}>Posts</a>
                            </li>
                            <li className="nav-item" style={{ marginRight: '5%' }}>
                                <a className={tabsClasses[1]} href="" onClick={this.moviesTab}>Movies</a>
                            </li>
                            <li className="nav-item" style={{ marginRight: '5%' }}>
                                <a className={tabsClasses[2]} href="" onClick={this.songsTab}>Songs</a>
                            </li>
                            <li className="nav-item" style={{ marginRight: '5%' }}>
                                <a className={tabsClasses[3]} href="" onClick={this.flashcardsTab}>Flashcards</a>
                            </li>
                        </ul>
                    </div>
                </div>
                {GRows}
                {this.state.activeTab === "Posts" && (
                    <Posts avatar={profPic} user={this.state.User} UpdateUserPosts={this.UpdateUserPosts} />
                )}
                {/* <div className="container">
                    <div className="row">
                        {rows}
                    </div>{
                        (this.props.location.state.canEdit === undefined) ?
                            <button onClick={this.fillForm1()} className="btn btn-secondary">Add</button>
                            : <div></div>}
                </div> */}

            </div >
        );
    }
}

export default Profile;