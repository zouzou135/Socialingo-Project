import React, { Component } from 'react';
import '../App.css';
import { Link } from 'react-router-dom';
import Nav from './custnav';
import image1 from '../images/WebBG2.png'

class News extends Component {
    constructor() {
        super();
        this.state = {
            ProfilePicture: '',
            Users: [],
            Languages: [],
            Language: '',
            News: [],
            Page: 1,
            SelectedReadMore: [],
        }
    }

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
                this.setState({ Language: responseJson[0].LanguageCode });
                this.fetchNews(responseJson[0].LanguageCode, this.state.Page);
            }).catch((error) => {
                alert(error);
            });
    }

    fetchNews = (language, page) => {

        let url = `https://cors-anywhere.herokuapp.com/http://newsapi.org/v2/top-headlines?language=${language}&page=${page}&apiKey=4e66db482a0f437b8d6fbf3bfb069526`;

        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },

        }).then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                this.setState({ News: [...this.state.News, responseJson] });
                for (var i = 0; i < responseJson.articles.length; i++) {
                    this.setState({ SelectedReadMore: [...this.state.SelectedReadMore, false] });
                }
            }).catch((error) => {
                alert(error);
            });

    }

    handleLanguageChange = event => {
        event.preventDefault();
        this.setState({ News: [] });
        this.setState({ Language: event.target.value });
        this.fetchNews(event.target.value, this.state.Page);
    }

    handleCategoryChange = event => {
        event.preventDefault();
        this.setState({ News: [] });
        this.setState({ Category: event.target.value });
        this.fetchNews(this.state.Language, this.state.Page);
    }

    nextPage = event => {
        event.preventDefault();
        this.setState({ Page: (this.state.Page + 1) });
        this.setState({ News: [] });
        this.fetchNews(this.state.Language, (this.state.Page + 1));
    }

    previousPage = event => {
        event.preventDefault();
        this.setState({ Page: (this.state.Page - 1) });
        this.setState({ News: [] });
        this.fetchNews(this.state.Language, (this.state.Page - 1));
    }

    selectReadMore = (event) => {
        event.preventDefault();
        let readSelected = [...this.state.SelectedReadMore];
        if (!readSelected[event.target.id])
            readSelected[event.target.id] = true;
        else
            readSelected[event.target.id] = false;
        this.setState({ SelectedReadMore: readSelected });
        console.log(readSelected);
    }

    render() {
        let rows = [];

        let options = [];
        let prevHidden = true, nextHidden = true;

        const contents = this.state.Languages.forEach((item, key) => {
            options.push(
                <option value={item.LanguageCode}>{item.LanguageName}</option>);
        });

        if (this.state.News.length !== 0) {
            console.log(this.state.News[0].totalResults)
            if (this.state.News[0].totalResults > 20) {
                if (Math.ceil(this.state.News[0].totalResults / 20) === this.state.Page) {
                    prevHidden = false;
                } else if (this.state.Page === 1) {
                    nextHidden = false;
                } else {
                    prevHidden = nextHidden = false;
                }
            }
            console.log(this.state.News);
            const contents1 = this.state.News[0].articles.forEach((item, key) => {
                let description = '';

                if (!this.state.SelectedReadMore[key]) {
                    if (item.description !== null) {
                        if (item.description.length > 90) {
                            description = [item.description.substring(0, 90), <a href='' id={key} onClick={this.selectReadMore}> read more</a>];
                        } else {
                            description = item.description;
                        }
                    }
                } else {
                    if (item.description !== null) {
                        description = [item.description, <a href='' id={key} onClick={this.selectReadMore}> read less</a>];
                    }
                }

                let image = image1;
                if (item.urlToImage !== null) {
                    image = item.urlToImage;
                }

                rows.push(
                    <div className="col-sm-4">
                        <div className="card my-3" style={{ width: "445px", borderRadius: "30px", borderWidth: "0px", boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)" }}>
                            <div style={{ position: "relative" }}><img style={{ borderTopLeftRadius: "30px", maxHeight: "200px", borderTopRightRadius: "30px", objectFit: "cover" }} src={image} className="card-img-top" alt="..." ></img>
                                <h5 className="card-header" style={{ color: "purple", backgroundColor: "purple", color: "white", position: "absolute", bottom: "-20px", width: "100%" }} >{item.title}</h5></div>
                            <div className="card-body">
                                <p className="card-text mt-3" style={{ color: "purple" }}>Source: {item.source.name}</p>
                                <p className="card-text" style={{ color: "purple" }}>{description}</p>
                                <div className="mt-3"><a style={{ textDecoration: "none" }} href={item.url} target="_blank" className="font-weight-bold">Go To Article</a></div>
                            </div>
                            {/* <h5 className="card-footer" style={{ color: "purple" }}><a className="font-weight-bold">User Comment: </a>{this.state.Songs[key].UserDescription}</h5> */}
                        </div >
                    </div >);

            });
        }

        return (
            <div >
                <Nav></Nav>
                <div>
                    <ul className="nav nav-pills mt-3 position-absolute" style={{ marginLeft: "36%", borderColor: "purple", borderStyle: "solid", borderRadius: "8px", width: "360px" }} id="pills-tab" role="tablist">
                        <li className="nav-item">
                            <Link className="nav-link" style={{ color: "purple" }} id="pills-home-tab" data-toggle="pill" to="/mediaM" role="tab" aria-controls="pills-home" aria-selected="true">Movies {"&"} Tv</Link>
                        </li>
                        <li class="nav-item">
                            <Link className="nav-link" id="pills-profile-tab" style={{ color: "purple" }} data-toggle="pill" to="/mediaS" role="tab" aria-controls="pills-profile" aria-selected="false">Music {"&"} Podcasts</Link>
                        </li>
                        <li class="nav-item">
                            <Link className="nav-link active" id="pills-profile-tab" style={{ backgroundColor: "purple" }} data-toggle="pill" to="/mediaN" role="tab" aria-controls="pills-profile" aria-selected="false">News</Link>
                        </li>
                    </ul>
                </div>
                <div className="row" style={{ marginTop: "18px", marginLeft: "2%", marginBottom: "20px" }}>
                    <select className="form-control col-xs-4" style={{ width: "150px" }} value={this.state.value} onChange={this.handleLanguageChange} required>
                        {options}
                    </select>
                </div>
                <h1 style={{ color: "purple", marginLeft: "2%" }}>Top Headlines</h1>
                <div className="row mx-2">
                    {rows}
                </div>
                <div style={{ display: "flex", flexDirection: "row-reverse", marginRight: "10px" }}>
                    <input hidden={nextHidden} className="buttonL font-weight-bold mt-3 mb-4 mx-1" type="Submit" onClick={this.nextPage} value="Next Page" />
                    <input hidden={prevHidden} className="buttonL font-weight-bold mt-3 mb-4 mx-1" type="Submit" onClick={this.previousPage} value="Previous Page" />
                </div>
            </div >
        );
    }
}

export default News;