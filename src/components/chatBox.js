import React from 'react';
import Chat from './Chat';
import UserList from './UserList';
import { ChatkitProvider, TokenProvider } from '@pusher/chatkit-client-react';
import * as SendBird from "sendbird";


// import Login from './Login';
// import chatkitLogo from './chatkit-logo.svg';

import './chatBox.css';
import Login from './login';
var sb = new SendBird({ appId: "B9E7C0C9-390A-4EEC-9E9F-3A215CFD7934" });
const instanceLocator = 'v1:us1:20385da1-b0ee-4951-94b1-300764c60052';

const tokenProvider = new TokenProvider({
    url: 'https://us1.pusherplatform.io/services/chatkit_token_provider/v1/20385da1-b0ee-4951-94b1-300764c60052/token',
});

function ChatBox(props) {
    // const urlParams = new URLSearchParams(window.location.search);
    const userId = localStorage.getItem("username");
    console.log(props.location.state.id, localStorage.getItem("username"));
    const otherUserId = props.location.state.id;
    let b64 = 0;
    let profPic = require('../images/DefaultPP.png');
    console.log(props.location.state);
    if (props.location.state.profPic !== '' && props.location.state.profPic !== null) {
        b64 = new Buffer(props.location.state.profPic).toString('base64');
        profPic = "data:image/png;base64," + b64;
    }

    sb.connect(userId, function (user, error) {
        if (error) {
            return;
        }
    });




    return (
        <div className="App">
            {userId && otherUserId ? (
                <>
                    <div className="App__chatwindow">
                        {/* <SendBirdProvider userId={userId} appId="B9E7C0C9-390A-4EEC-9E9F-3A215CFD7934"> */}
                        {/* <ChatkitProvider
                            instanceLocator={instanceLocator}
                            tokenProvider={tokenProvider}
                            userId={userId}
                        > */}
                        {/* <UserList userId={userId} /> */}
                        <Chat otherUserId={otherUserId} profPic={profPic} otherUser={otherUserId} sb={sb} />
                        {/* </ChatkitProvider> */}
                        {/* </SendBirdProvider> */}
                    </div>
                </>
            ) : (
                    <div> </div>
                )}
            <div className="App__backdrop">
                {/* <img
                    className="App__backdrop__logo"
                    src={chatkitLogo}
                    alt="Chatkit logo"
                /> */}
            </div>
        </div>
    );
}

export default ChatBox;