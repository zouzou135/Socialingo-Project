import React, { Component } from 'react';
import '../App.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Rater from 'react-rater';
import 'react-rater/lib/react-rater.css'
import Nav from './custnav';

class Search extends Component {
    constructor() {
        super();
        this.addButton = this.addButton.bind(this);
        this.state = {
            data: [],
            added: [],
            searchTerm: '',
            ratings: [],
            Languages: [],
            Language: '',
        }
    }

    redirectToHome = () => {
        const { history } = this.props;
        if (history) history.push('/UserForm');
    }

    componentDidMount() {
        this.fetchLanguages();
        console.log(this.state.added);
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
                this.fetchPacks(responseJson[0].LanguageID);
            }).catch((error) => {
                alert(error);
            });
    }

    handleSearchChange = event => {
        event.preventDefault();
        this.setState({ searchTerm: event.target.value });
    }

    fetchRatings = () => {
        let url = 'http://localhost:3001/flashcards/searchRating';

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
                this.setState({ ratings: responseJson })
            }).catch((error) => {
                alert(error);
            });
    }

    handleLanguageChange = event => {
        event.preventDefault();
        this.setState({ data: [] });
        // this.setState({ added: [] });
        this.setState({ Language: event.target.value });
        console.log(event.target);
        this.fetchPacks(event.target.value);
    }

    fetchPacks = (Flanguage) => {

        let url = 'http://localhost:3001/flashcards/searchFC';

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },

            body: JSON.stringify({
                userId: localStorage.getItem("id"),
                searchTerm: this.state.searchTerm,
                language: Flanguage,
            })

        }).then((response) => response.json())
            .then((responseJson) => {
                let resp = responseJson;
                this.fetchRatings();
                const contents = responseJson.forEach((item, key) => {
                    let url = 'http://localhost:3001/flashcards/checkFC';

                    fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },

                        body: JSON.stringify({
                            userId: localStorage.getItem("id"),
                            flashcardPackID: item.FlashcardPackID,
                        })

                    }).then((response) => response.json())
                        .then((responseJson) => {
                            this.state.added[key] = responseJson.length;
                            console.log(responseJson);
                            this.setState({ data: resp });
                        }).catch((error) => {
                            alert(error);
                        });

                });

                // this.setState({ added: new Array(responseJson.length) });
                // console.log(this.state.added);

            }).catch((error) => {
                alert(error);
            });
    }

    searchFunction = (event) => {
        event.preventDefault();
        this.fetchPacks(this.state.Language);
    }

    addButton = item => event => {
        event.preventDefault();

        if (event.target.id === "Add") {
            let url = 'http://localhost:3001/flashcards/addFlashcardPack';

            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },

                body: JSON.stringify({
                    flashcardPackID: item.FlashcardPackID,
                    flashcardPackName: item.FlashcardPackName,
                    flashcardPackRating: item.FlashcardPackRating,
                    userID: localStorage.getItem("id")
                })

            }).then((response) => response.json())
                .then((responseJson) => {
                    console.log(responseJson);
                }).catch((error) => {
                    alert(error);
                });
        } else {
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
        }
        this.fetchPacks(this.state.Language);

        // this.props.history.push('/UserForm', {
        //     flashcardPackID: item.FlashcardPackID, flashcardPackName: item.FlashcardPackName, flashcardPackRating: item.FlashcardPackRating, userID: localStorage.getItem("id")
        // });
    }

    rateFunction = (item, oldRating) => event => {
        // event.preventDefault();

        // console.log(event.rating, oldRating);

        let url = 'http://localhost:3001/flashcards/updateRating';

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },

            body: JSON.stringify({
                flashcardPackID: item.FlashcardPackID,
                flashcardPackNRatings: (item.FlashcardPackNRatings),
                flashcardPackRating: item.FlashcardPackRating,
                flashcardPackRatingUser: event.rating,
                userID: localStorage.getItem("id"),
                oldRating: oldRating,
            })

        }).then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                this.fetchPacks(this.state.Language);
            }).catch((error) => {
                alert(error);
            });
    }

    logout = () => event => {
        event.preventDefault();
        localStorage.clear();
        this.props.history.push('/');
    }

    flashcard = () => event => {
        event.preventDefault();
        this.props.history.push('/flashcards', { flashcardPackID: event.target.id, flashcardPackName: event.target.name, canEdit: false });
    }

    quiz = () => {
        let url = 'http://localhost:3001/flashcards/checkFlashcards';
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
                if (responseJson.length < 4) {
                    alert("You need to have at least 4 flashcards")
                } else {
                    this.props.history.push('/quizForm', { flashcards: responseJson });
                }
            }).catch((error) => {
                alert('Failed to Save.');
            });
    }

    render() {
        let options = [];

        const contents1 = this.state.Languages.forEach((item, key) => {
            options.push(
                <option value={item.LanguageID}>{item.LanguageName}</option>);
        });


        let rows = [];
        const contents = this.state.data.forEach((item, key) => {
            let addOrRemove = "Add";
            if (this.state.added[key] === 1) {
                addOrRemove = "Remove";
            }

            let ratingFP = 0;
            for (let i = 0; i < this.state.ratings.length; i++) {
                if (this.state.ratings[i].RatingFlashcardPackID === item.FlashcardPackID) {
                    ratingFP = this.state.ratings[i].Rating;
                }
            }
            rows.push(
                <div className="col-sm-3">
                    <div className="card my-3" style={{ borderRadius: "30px", borderTopLeftRadius: "35px", borderTopRightRadius: "35px", borderWidth: "0px", boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)" }}>
                        <h5 className="card-header" style={{ transform: "rotate(0)", backgroundColor: "purple", borderTopLeftRadius: "30px", borderTopRightRadius: "30px" }}><a href="" class="stretched-link" id={item.FlashcardPackID} name={item.FlashcardPackName} style={{ textDecoration: "none", color: "white" }} onClick={this.flashcard()}>{item.FlashcardPackName}</a></h5>
                        <div className="card-body">
                            <p className="card-text">{item.FlashcardPackDescription}</p>
                            <div>
                                <button onClick={this.addButton(item)} id={addOrRemove} className="buttonL mr-1" >{addOrRemove}</button>
                            </div>
                        </div>
                        <div className="card-footer">
                            {(item.FlashcardPackRating !== null) ?
                                <p className="card-text">Rating: {item.FlashcardPackRating}/5<sub>({item.FlashcardPackNRatings})</sub></p>
                                : <p className="card-text">No Rating</p>}
                            <label className="mr-3">Rate: </label><Rater total={5} rating={ratingFP} onRate={this.rateFunction(item, ratingFP)} />
                        </div>
                    </div >
                </div >);
        })
        return (
            <div>
                <Nav></Nav>
                <div className="container searchPage">
                    <div className="searchBar">
                        <form onSubmit={this.searchFunction} method="POST" className="form-inline " >
                            <select style={{ marginRight: "60%", width: "190px" }} className="form-control" value={this.state.value} onChange={this.handleLanguageChange} >
                                {options}
                            </select>
                            <input style={{ width: "190px" }} className="form-control" onChange={this.handleSearchChange} type="text" placeholder="Search..." name="search"></input>
                            <button type="submit" className="btn"><i><FontAwesomeIcon style={{ transform: "rotate(90deg)" }}
                                icon={faSearch}
                            /></i></button>
                        </form>
                    </div>
                    <div className="row">
                        {rows}
                    </div>
                </div>
            </div >
        );
    }
}

export default Search;