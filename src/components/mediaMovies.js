import React, { Component } from 'react';
import '../App.css';
import { Link } from 'react-router-dom';
import Nav from './custnav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import YouTube from 'react-youtube';
import Toggle from 'react-toggle';
import "react-toggle/style.css"
// import "bootstrap-material-design/dist/css/bootstrap-material-design.css";

class Movies extends Component {
    constructor() {
        super();
        this.state = {
            ProfilePicture: '',
            Users: [],
            Languages: [],
            Language: '',
            Movies: [],
            MovieInfo: [],
            clickedMovieI: '',
            isHidden: true,
            isHInfo: true,
            trailerCode: '',
            LanguageCode: '',
            imdLink: '',
            isEnglish: false,
        }
        this.playerRef = React.createRef();
    }

    componentDidMount() {
        this.fetchLanguages();
    }

    // componentDidUpdate(prevState) {
    //     console.log(this.state.isEnglish, prevState.location)
    //     if (this.state.isEnglish !== prevState.isEnglish) {
    //         this.fetchMovies(13);
    //     }
    // }

    handleLanguageChange = event => {
        event.preventDefault();
        this.setState({ MovieInfo: [] });
        this.setState({ Movies: [] });
        this.setState({ Language: event.target.value });
        this.setState({ clickedMovieI: '' });
        this.setState({ isHidden: true });
        this.setState({ isEnglish: false });
        this.setState({ isHInfo: true });

        console.log(event.target);
        this.fetchMovies(event.target.value);
    }

    fetchMovies = (language) => {

        let url = 'http://localhost:3001/suggestion/movies';

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
                    this.setState({ Movies: responseJson });
                    let prevResponse = responseJson;

                    var api_key = 'f41e8dda582116a9ae5b0d01d10de92a';

                    let url;

                    let langCode = '';
                    if (!this.state.isEnglish) {
                        for (var z = 0; z < this.state.Languages.length; z++) {
                            if (this.state.Languages[z].LanguageID == this.state.Language) {
                                langCode = this.state.Languages[z].LanguageCode;
                                this.setState({ LanguageCode: langCode });
                            }
                            console.log(this.state.Languages[z].LanguageID, this.state.Language)
                        }
                    } else {
                        console.log("hi")
                        langCode = "en";
                        this.setState({ LanguageCode: langCode });
                    }

                    console.log(langCode);

                    for (var j = 0; j < prevResponse.length; j++) {
                        console.log(prevResponse[j].Type);
                        if (prevResponse[j].Type === "tv") {
                            url = `https://api.themoviedb.org/3/tv/${prevResponse[j].MovieID}?api_key=${api_key}&Language=${langCode}`;
                        } else {
                            url = `https://api.themoviedb.org/3/movie/${prevResponse[j].MovieID}?api_key=${api_key}&Language=${langCode}`;
                        }


                        fetch(url, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                            },

                        }).then((response) => response.json())
                            .then((responseJson) => {
                                // for (var i = 0; i < prevResponse.length; i++) {
                                console.log(responseJson);
                                this.setState({ MovieInfo: [...this.state.MovieInfo, responseJson] });
                                // let editableMovieInfo = [...this.state.MovieInfo];
                                // editableMovieInfo[j] = responseJson;
                                // this.setState({ MovieInfo: editableMovieInfo });
                                console.log(this.state.MovieInfo);
                                // }
                            }).catch((error) => {
                                alert(error);
                            });
                    }

                }).catch((error) => {
                    alert(error);
                });
        }
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
                this.fetchMovies(responseJson[0].LanguageID);
            }).catch((error) => {
                alert(error);
            });
    }

    addSuggestion = (event) => {
        event.preventDefault();
        this.props.history.push('/movieForm', { id: localStorage.getItem("id") });
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

    handleEnglishStatus = (event) => {
        event.preventDefault();
        this.setState({ Movies: [] });
        this.setState({ MovieInfo: [] });
        this.setState({ clickedMovieI: '' });
        this.setState({ isHidden: true });
        this.setState({ isHInfo: true });

        if (!this.state.isEnglish) {
            this.setState({ isEnglish: true });

            this.fetchMovies(this.state.Language);
        } else {
            this.setState({ isEnglish: false });
            this.fetchMovies(this.state.Language);
        }
        // console.log(event.target);
        // this.setState({ clickedMovieI: '' });
        // console.log(this.playerRef.current);
        // this.playerRef.current.internalPlayer.stopVideo();
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

    _onReady = (event) => {

    }

    render() {

        const opts = {
            height: '350',
            width: '120%',
            playerVars: { // https://developers.google.com/youtube/player_parameters
                autoplay: 0
            }
        };

        let options = [];

        const contents = this.state.Languages.forEach((item, key) => {
            options.push(
                <option value={item.LanguageID}>{item.LanguageName}</option>);
        });

        let columns = [];

        for (var j = 0; j < this.state.MovieInfo.length / 5; j++) {
            let rows = [];
            if (this.state.MovieInfo !== []) {
                const contents1 = this.state.MovieInfo.forEach((item, key) => {
                    let hide = true;
                    // let marginT = '40%';
                    // console.log(key, this.state.clickedMovieI)
                    if (key === this.state.clickedMovieI && !this.state.isHidden) {
                        hide = false;
                        // marginT = '28%';
                    }
                    if (key % 5 === 0) {
                        rows.push();
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
                });

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
            console.log(homepage)

            columns.push(
                <div>
                    <div className="item-container">
                        {rows}
                    </div>
                    <div>
                        <div className="content" hidden={this.state.isHInfo} style={{ marginTop: "-13px" }}>
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


        return (
            <div>
                <Nav></Nav>
                <div>
                    <ul className="nav nav-pills mt-3 position-absolute" style={{ marginLeft: "36%", borderColor: "purple", borderStyle: "solid", borderRadius: "8px", width: "360px" }} id="pills-tab" role="tablist">
                        <li className="nav-item">
                            <Link className="nav-link active" style={{ backgroundColor: "purple" }} id="pills-home-tab" data-toggle="pill" to="/mediaM" role="tab" aria-controls="pills-home" aria-selected="true">Movies {"&"} Tv</Link>
                        </li>
                        <li class="nav-item">
                            <Link className="nav-link" id="pills-profile-tab" style={{ color: "purple" }} data-toggle="pill" to="/mediaS" role="tab" aria-controls="pills-profile" aria-selected="false">Music {"&"} Podcasts</Link>
                        </li>
                        <li class="nav-item">
                            <Link className="nav-link" id="pills-profile-tab" style={{ color: "purple" }} data-toggle="pill" to="/mediaN" role="tab" aria-controls="pills-profile" aria-selected="false">News</Link>
                        </li>
                    </ul>
                    <button className="buttonL font-weight-bold mt-3" style={{ marginLeft: "87%" }} onClick={this.addSuggestion}>Add Suggestion</button>

                    <div className="row" style={{ marginTop: "-38px", marginLeft: "2%", marginBottom: "20px" }}>
                        <div style={{ width: "150px" }}>
                            <select className="form-control col-xs-4" value={this.state.value} onChange={this.handleLanguageChange} required>
                                {options}
                            </select>
                        </div>
                        <div className="col-xs-4"> <Toggle
                            className="ml-4 mt-2"
                            id='english-status'
                            checked={this.state.isEnglish}
                            onChange={this.handleEnglishStatus}
                            icons={false}
                        /></div>
                        <label className="ml-2 mt-2 font-weight-bold" style={{ color: "purple" }} htmlFor='english-status'>English</label>
                    </div>
                </div>
                {columns}
                {/* <div className="item-container">
                    {rows}
                </div> */}
            </div >
        );
    }
}

export default Movies;