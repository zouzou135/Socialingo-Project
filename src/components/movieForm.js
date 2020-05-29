import React, { Component } from 'react';
import '../App.css';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faComment } from '@fortawesome/free-solid-svg-icons';
// import { faFilm } from '@fortawesome/free-solid-svg-icons';
// import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { CountryDropdown } from 'react-country-region-selector';
import { text } from '@fortawesome/fontawesome-svg-core';

class MovieForm extends Component {
    constructor(props) {
        super(props);
        // This binding is necessary to make `this` work in the callback
        this.submitFunction = this.submitFunction.bind(this);
        this.state = {
            MovieName: '', Language: '',
            Languages: [],
            Movie: [],
            SelectedKey: '',
            SelectedReadMore: [],
            Description: '',
        }
        this.popup = null;
    }

    componentDidMount() {
        this.fetchLanguages();
    }

    handleSearchChange = event => {
        event.preventDefault();
        this.setState({ MovieName: event.target.value.replace(/\s/g, '%20') });
        var api_key = 'f41e8dda582116a9ae5b0d01d10de92a';

        let url = `https://api.themoviedb.org/3/search/multi?api_key=${api_key}&query=${event.target.value.replace(/\s/g, '%20')}&language=${this.state.Language}&page=1`;

        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },

        }).then((response) => response.json())
            .then((responseJson) => {
                this.setState({ Movie: responseJson })
                for (var i = 0; i < responseJson.length; i++) {
                    this.setState({ SelectedReadMore: [...this.state.SelectedReadMore, false] });
                }
            }).catch((error) => {
                alert(error);
            });
    }

    handleLanguageChange = event => {
        event.preventDefault();
        this.setState({ Language: event.target.value });
        console.log(event.target);
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
        let url = 'http://localhost:3001/suggestion/insertMovie';

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
                movieID: this.state.Movie.results[this.state.SelectedKey].id,
                movieType: this.state.Movie.results[this.state.SelectedKey].media_type,
                movieLanguage: languageID,
                userDescription: this.state.Description,
            })

        }).then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                this.props.history.push('/mediaM', {});
            }).catch((error) => {
                alert(error);
            });
    }

    selectMovie = (event) => {
        event.preventDefault();
        this.setState({ SelectedKey: parseInt(event.target.id, 10) });
    }

    selectReadMore = (event) => {
        event.preventDefault();
        let readSelected = [...this.state.SelectedReadMore];
        if (!readSelected[event.target.id])
            readSelected[event.target.id] = true;
        else
            readSelected[event.target.id] = false;
        this.setState({ SelectedReadMore: readSelected });
    }

    render() {
        const { Country } = this.state;

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
        if (this.state.SelectedKey === '' && this.state.MovieName !== '') {
            searchClass = "form-control w-50 is-invalid";
        }

        if (this.state.Movie.length !== 0 && this.state.Movie.results != undefined) {
            const contents1 = this.state.Movie.results.forEach((item, key) => {
                var bgColor = "", textColor = "purple", borderColor = "";
                var overview = '';
                console.log(key, this.state.SelectedKey);
                if (this.state.SelectedKey === key && this.state.SelectedKey !== "") {
                    bgColor = "purple";
                    textColor = "white";
                    borderColor = "purple";
                }

                if (item.media_type === "tv") {
                    if (!this.state.SelectedReadMore[key]) {
                        if (item.overview.length > 100) {
                            overview = [item.overview.substring(0, 100), <a href='' id={key} onClick={this.selectReadMore}> read more</a>];
                        } else {
                            overview = item.overview;
                        }
                    } else {
                        overview = [item.overview, <a href='' id={key} onClick={this.selectReadMore}> read less</a>];
                    }
                    rows.push(
                        <div className="col-sm-4">
                            <div className="card my-2 mx-2" style={{ width: "270px", borderColor: borderColor }}>
                                <div style={{ transform: "rotate(0)" }} ><a id={key} className="stretched-link" href="" onClick={this.selectMovie}></a><img src={"https://image.tmdb.org/t/p/original" + item.backdrop_path} className="card-img-top" alt="..." ></img></div>
                                <h5 className="card-header" style={{ backgroundColor: bgColor, transform: "rotate(0)" }}><a id={key} style={{ color: textColor, textDecoration: "none" }} className="stretched-link" href="" onClick={this.selectMovie}>{item.name}</a></h5>
                                <div className="card-body">
                                    <p className="card-text">{overview}</p>
                                </div>
                            </div >
                        </div >);
                } else if (item.media_type === "movie") {
                    if (!this.state.SelectedReadMore[key]) {
                        if (item.overview.length > 100) {
                            overview = [item.overview.substring(0, 100), <a href='' id={key} onClick={this.selectReadMore}> read more</a>];
                        } else {
                            overview = item.overview;
                        }
                    } else {
                        overview = [item.overview, <a href='' id={key} onClick={this.selectReadMore}> read less</a>];
                    }
                    rows.push(
                        <div className="col-sm-4">
                            <div className="card my-2" style={{ width: "270px", borderColor: borderColor }}>
                                <div style={{ transform: "rotate(0)" }} ><a id={key} className="stretched-link" href="" onClick={this.selectMovie}></a><img src={"https://image.tmdb.org/t/p/original" + item.backdrop_path} className="card-img-top" alt="..." ></img></div>
                                <h5 className="card-header" style={{ backgroundColor: bgColor, transform: "rotate(0)" }}><a id={key} style={{ color: textColor, textDecoration: "none" }} className="stretched-link" href="" onClick={this.selectMovie}>{item.title}</a></h5>
                                <div className="card-body">
                                    <p className="card-text">{overview}</p>
                                </div>
                            </div >
                        </div >);
                }
            });
        }

        return (

            <div>
                <div className="suggest-page">
                    <form onSubmit={this.submitFunction} method="POST" className="">
                        <div>
                            <h3 className="font-weight-bold" style={{ color: "purple", marginLeft: "-35px" }}>Suggest A Movie Or TV Show</h3>
                        </div>
                        <div className="form-group ">
                            <select className="form-control w-50" value={this.state.value} onChange={this.handleLanguageChange} required>
                                <option value="" selected disabled hidden>Language</option>
                                {options}
                            </select>
                        </div>
                        <div className="form-group ">
                            <input className={searchClass} type="text" onChange={this.handleSearchChange} name="movieSearch" id="movieSearch" placeholder="Search..." hidden={isHidden} required />
                            <span className='invalid-feedback'>Select a movie or tv show</span>
                        </div>
                        <div className="form-group">
                            <textarea className="form-control animated w-50" type="text" onChange={this.handleDescriptionChange} name="description" id="description" placeholder="Comment" hidden={isHidden} required />
                            {/* <span className='invalid-feedback'>{this.state.errors.email}</span> */}
                        </div>
                        <input className="buttonL font-weight-bold" type="Submit" value="Submit" />
                    </form>
                </div>
                <div style={{ marginLeft: "35%", marginTop: "-30%" }}>
                    {/* <div>
                                <h3 className="font-weight-bold my-3" style={{ color: "purple", textAlign: "center" }}>Select the Movie or Tv Show you want</h3>
                            </div> */}
                    <div className="row mx-2">
                        {rows}
                    </div>
                </div>
            </div>

        );
    }
}

export default MovieForm;