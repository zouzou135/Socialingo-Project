import React, { useState } from 'react';
import './UserList.css';
import defaultAvatar from '../images/DefaultPP.png';


const UserList = ({ userId }) => {
    const [profPic, setProfPic] = useState('');

    const fetchProfilePicture = () => {
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
                    setProfPic(responseJson.ProfilePicture);
                    if (profPic != '') {
                        var b64;
                        console.log(profPic);
                        b64 = new Buffer(profPic).toString('base64');
                        setProfPic("data:image/png;base64," + b64);
                        // this.setState({ ProfilePicture: responseJson.ProfilePicture.data });
                    }
                }
            }).catch((error) => {
                alert(error);
            });
    }

    // const fetchProfilePicture = () => {

    // }



    return (
        <div className="UserList">
            <div className="UserList__titlebar">
                <img
                    src={profPic}
                    className="UserList__titlebar__avatar"
                    alt="avatar"
                />
                <span className="UserList__titlebar__logged-in-as">{userId}</span>
            </div>
            <div className="UserList__container">
                <ul className="UserList__container__list">
                    <li className="UserList__container__list__item">
                        <div>
                            <img
                                src={defaultAvatar}
                                className="UserList__container__list__item__avatar"
                                alt="avatar"
                            />
                        </div>
                        <div className="UserList__container__list__item__content">
                            <p className="UserList__container__list__item__content__name">
                                Alice Andrews
              </p>
                            <p className="UserList__container__list__item__content__text">
                                You: That would be great!
              </p>
                        </div>
                        <div className="UserList__container__list__item__time">
                            10:01 AM
            </div>
                    </li>
                    <li className="UserList__container__list__item UserList__container__list__item--selected">
                        <div>
                            <img
                                src={defaultAvatar}
                                className="UserList__container__list__item__avatar"
                                alt="avatar"
                            />
                        </div>
                        <div className="UserList__container__list__item__content">
                            <p className="UserList__container__list__item__content__name">
                                Joe Bloggs
              </p>
                            <p className="UserList__container__list__item__content__text">
                                Joe: Not bad, how was yours?
              </p>
                        </div>
                        <div className="UserList__container__list__item__time">9:38 AM</div>
                    </li>
                    <li className="UserList__container__list__item">
                        <div>
                            <img
                                src={defaultAvatar}
                                className="UserList__container__list__item__avatar"
                                alt="avatar"
                            />
                        </div>
                        <div className="UserList__container__list__item__content">
                            <p className="UserList__container__list__item__content__name">
                                Jane Smith
              </p>
                            <p className="UserList__container__list__item__content__text">
                                Jane: Did you get the files I sent yesterday?
              </p>
                        </div>
                        <div className="UserList__container__list__item__time">
                            Yesterday
            </div>
                    </li>
                </ul>
            </div>
        </div>
    );
}



export default UserList;