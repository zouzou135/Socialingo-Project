import Moment from 'react-moment';
import React, { useState, useEffect } from 'react';
import { withChatkitOneToOne } from '@pusher/chatkit-client-react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faMicrophone, faSquare } from '@fortawesome/free-solid-svg-icons';
import { ReactMic } from 'react-mic';
import AudioPlayer from 'react-modular-audio-player';
import playButton from '../images/playButton.png'
import pauseButton from '../images/pauseButton.png'
import playButtonH from '../images/playButtonH.png'
import pauseButtonH from '../images/pauseButtonH.png'
import soundOn from '../images/soundOn.png'
import soundOff from '../images/soundOff.png'

import './Chat.css';
import defaultAvatar from '../images/DefaultPP.png';

function Chat(props) {
    const [pendingMessage, setPendingMessage] = useState('');
    const [record, setRecord] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [audio, setAudio] = useState('');
    const messageList = React.createRef();
    const [oldMessages, setOldMessages] = useState([]);
    const [gChannel, setGChannel] = useState({});


    const handleMessageKeyDown = event => {
        if (event.key === 'Enter') {
            handleSendMessage();
        }
    };

    const onData = (recordedBlob) => {
        console.log('chunk of real-time data is: ', recordedBlob);
    }

    const onStop = (recordedBlob) => {
        recordedBlob.blob.arrayBuffer().then(buffer => {
            var buf = Buffer.alloc(buffer.byteLength);
            var view = new Uint8Array(buffer);
            for (var i = 0; i < buf.length; ++i) {
                buf[i] = view[i];
            }
            // recordedBlob.blob.lastModifiedDate = new Date();
            // recordedBlob.blob.name = "something.mp3";
            var reader = new FileReader();
            reader.readAsDataURL(recordedBlob.blob);
            reader.onloadend = function () {
                var base64data = reader.result;
                console.log(buffer);
                console.log(buf);
                console.log(base64data);
                setAudio(base64data);
            }



        });
        // console.log('recordedBlob is: ');
        // let buffer = new Buffer.alloc(recordedBlob.blob.size, recordedBlob.blob);
        // console.log('recordedBlob is: ', buffer);
        // setAudio(recordedBlob.blob);
    }


    const handleMessageChange = event => {
        setPendingMessage(event.target.value);
    };

    const handleRecordMessage = () => {
        if (!record) {
            setRecord(true);
            setIsRecording(true);
        } else {
            if (isRecording) {
                setIsRecording(false);
            } else {
                setIsRecording(true);
            }
        }
        console.log(isRecording);
    };

    const handleRecordCancel = () => {
        if (record) {
            setRecord(false);
            setIsRecording(false);
        }
        console.log(isRecording);
    };

    const handleSendMessage = () => {
        if (pendingMessage === '' && !record) {
            return;
        }
        // TODO: Send message to Chatkit
        if (!record) {


            const params = new props.sb.UserMessageParams();

            params.message = pendingMessage;
            // params.customType = CUSTOM_TYPE;
            // params.data = DATA;
            // params.mentionType = 'users';                       // Either 'users' or 'channel'
            // params.mentionedUserIds = ['Jeff', 'Julia'];        // Or mentionedUsers = Array<User>; 
            // params.metaArrayKeys = ['linkTo', 'itemType'];
            // params.translationTargetLanguages = ['fe', 'de'];   // French and German
            // params.pushNotificationDeliveryOption = 'default';  // Either 'default' or 'suppress' 

            gChannel.sendUserMessage(params, function (message, error) {
                if (error) {
                    alert(message)
                    return;
                }

                console.log(message);
            });


            // props.chatkit.sendSimpleMessage({ text: pendingMessage })
        } else {

            if (isRecording) {
                setIsRecording(false);
                console.log(audio);
            }

            // const params = new props.sb.FileMessageParams();
            console.log(audio)
            // params.file = audio;
            // params.message = pendingMessage;
            // params.customType = CUSTOM_TYPE;
            // params.data = DATA;
            // params.mentionType = 'users';                       // Either 'users' or 'channel'
            // params.mentionedUserIds = ['Jeff', 'Julia'];        // Or mentionedUsers = Array<User>; 
            // params.metaArrayKeys = ['linkTo', 'itemType'];
            // params.translationTargetLanguages = ['fe', 'de'];   // French and German
            // params.pushNotificationDeliveryOption = 'default';  // Either 'default' or 'suppress' 

            gChannel.sendFileMessage(audio, function (fileMessage, error) {
                if (error) {
                    alert(error)
                    return;
                }
                console.log(soundOn)
                console.log(fileMessage);
            });

            // props.chatkit.sendMultipartMessage({
            //     parts: [
            //         // { type: "text/plain", content: "🐷😍" },
            //         // {
            //         //   type: "image/gif",
            //         //   url: "https://gfycat.com/failingforkedheterodontosaurus",
            //         // },
            //         {
            //             file: audio,
            //         }
            //     ],
            // })
        }
        setPendingMessage('');
    };

    useEffect(() => {
        messageList.current.scrollTop = messageList.current.scrollHeight;
    });

    var userIds = [localStorage.getItem("username"), props.otherUser];
    props.sb.GroupChannel.createChannelWithUserIds(userIds, true, props.otherUser, function (groupChannel, error) {
        if (error) {
            return;
        }

        var prevMessageListQuery = groupChannel.createPreviousMessageListQuery();

        prevMessageListQuery.load(function (messages, error) {
            console.log(messages)
            if (error) {
                return;
            }
            setOldMessages(messages);
            if (messages[0] !== undefined)
                console.log(messages[0].sender.userId);
            console.log(localStorage.getItem("username"));
        });
        console.log(groupChannel);
        setGChannel(groupChannel)
    });
    console.log(oldMessages)
    // console.log(prevMessageListQuery)
    // TODO: Show messages from Chatkit
    const messages = oldMessages.map(m => ({
        id: m.messageId,
        isOwnMessage: m.sender.userId === localStorage.getItem("username"),
        createdAt: m.createdAt,
        // This will only work with simple messages.
        // To learn more about displaying multi-part messages see
        // https://pusher.com/docs/chatkit/reference/javascript#messages
        textContent: m.message,
        parts: m.url,
    }));

    return (
        <div className="Chat">
            <div className="Chat__titlebar">
                <img
                    src={props.profPic}
                    className="Chat__titlebar__avatar"
                    alt="avatar"
                />
                <div className="Chat__titlebar__details">
                    {/*TODO: Get other user's name from Chatkit */}
                    <span>{props.otherUser}
                    </span>
                </div>
                <Link to="/chats" className="Close_Button"><FontAwesomeIcon icon={faTimes} ></FontAwesomeIcon></Link>
            </div>
            <div className="Chat__messages" ref={messageList}>
                {messages.map(m => (
                    <Message key={m.id} {...m} />
                ))}
            </div>
            <div className="Chat__compose">
                {record ?
                    <text className="Chat__recording">Voice Message</text>
                    : <div></div>}
                {
                    !record ?
                        <input
                            className="Chat__compose__input"
                            type="text"
                            placeholder="Type a message..."
                            value={pendingMessage}
                            onChange={handleMessageChange}
                            onKeyDown={handleMessageKeyDown}
                        />
                        :
                        <div>
                            <ReactMic
                                className="Chat__record__wave"
                                // width="100%"
                                record={isRecording}
                                onStop={onStop}
                                onData={onData}
                                mimeType="audio/mp3"
                                strokeColor="purple"
                                backgroundColor="#ffffff00" />
                        </div>


                }
                <button className="Chat__compose__button" onClick={handleSendMessage}>
                    Send
        </button>
                <button className="Chat__compose__button" onClick={handleRecordMessage}>
                    {!isRecording ?
                        <FontAwesomeIcon icon={faMicrophone} ></FontAwesomeIcon>
                        :
                        <FontAwesomeIcon icon={faSquare} ></FontAwesomeIcon>
                    }
                </button>
                {record ?
                    <button className="Chat__compose__button" onClick={handleRecordCancel}>
                        Cancel
                    </button>
                    : <div></div>}
            </div>
        </div>
    );
}



function Message({ isOwnMessage, isLatestMessage, createdAt, textContent, parts }) {
    // async function msg() {
    //     console.log(parts);
    //     let url = await parts.url();
    // }
    // msg();
    console.log(parts);

    let rearrangedPlayer = [
        {
            className: "adele",
            innerComponents: [
                {
                    type: "play",
                    style: {
                        justifyContent: "flex-start",
                    }
                }, {
                    type: "seek",
                    style: {
                        marginLeft: "-200px"
                    }
                }

            ]
        }
    ];


    return (
        <div
            className={
                isOwnMessage
                    ? 'Chat__messages__message__wrapper Chat__messages__message__wrapper--self'
                    : 'Chat__messages__message__wrapper Chat__messages__message__wrapper--other'
            }
        >
            <div className="Chat__messages__message__wrapper__inner">
                <div
                    className={
                        isOwnMessage
                            ? 'Chat__messages__message Chat__messages__message--self'
                            : 'Chat__messages__message Chat__messages__message--other'
                    }
                >
                    {textContent !== undefined ?
                        <div className="Chat__messages__message__content">{textContent}</div>
                        : <AudioPlayer
                            audioFiles={[
                                {
                                    src: parts,
                                },
                            ]}
                            fontColor="purple"
                            playerWidth="98%"
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
                            hideTime
                            rearrange={rearrangedPlayer}
                        />
                    }
                    <div className="Chat__messages__message__time">
                        <Moment
                            calendar={{
                                sameDay: 'LT',
                                lastDay: '[Yesterday at] LT',
                                lastWeek: '[last] dddd [at] LT',
                            }}
                        >
                            {createdAt}
                        </Moment>
                    </div>
                    <div
                        className={
                            isOwnMessage
                                ? 'Chat__messages__message__arrow alt'
                                : 'Chat__messages__message__arrow'
                        }
                    />
                </div>
            </div>
        </div>
    );
}

export default Chat;