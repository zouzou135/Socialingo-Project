import React, { Component } from 'react';
import '../App.css';
import newsAPILogo from '../images/NewsAPI.png'

class Footer extends Component {
    constructor() {
        super();
        this.state = {
        }
    }

    componentDidMount() {
    }


    render() {


        return (
            <div className="footer">
                <div className="footer-content">
                    <h5 style={{ fontSize: "16px" }}> powered by:    </h5>
                    <a style={{ textDecoration: "none" }} href="https://pusher.com/chatkit" target="_blank"><img className="mr-5" src="https://d21buns5ku92am.cloudfront.net/67967/images/293624-chatkit_logo-0bb022-medium-1539767767.png" alt="Chatkit API" width="20%"></img></a>
                    <a style={{ textDecoration: "none" }} href="https://www.themoviedb.org/documentation/api" target="_blank"><img className="mr-5" src="https://raw.githubusercontent.com/zisiszikos/the-movie-db-example/master/tmdb.png" alt="Movie DB API" width="20%"></img></a>
                    <a style={{ textDecoration: "none" }} href="https://developers.deezer.com/api" target="_blank"><img className="mr-5" src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Deezer_logo.svg/1280px-Deezer_logo.svg.png" alt="Deezer API" width="20%"></img></a>
                    <a style={{ textDecoration: "none" }} href="https://newsapi.org/docs" target="_blank"><img className="mr-5" src={newsAPILogo} alt="News API" width="20%"></img></a>
                </div>
                <div className="footer-bottom">
                    &copy; Socialingo 2020
                </div>
            </div >
        );
    }
}

export default Footer;