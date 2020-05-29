var express = require('express');
var app = express();
app.set('view engine', 'ejs');
var login = require('./routes/login.js');
var profile = require('./routes/profile.js');
var chats = require('./routes/chats.js');
var suggestion = require('./routes/suggestion.js');
var flashcards = require('./routes/flashcards.js');
const postsRoute = require('./routes/post');
const commentRoute = require('./routes/comment');
const likeRoute = require('./routes/like');
var server = require('http').Server(app);
var io = require('socket.io')(server);
app.set('socketio', io);
bodyParser = require('body-parser');

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const fileUpload = require('express-fileupload');

var cors = require('cors');
app.use(cors());
app.use(bodyParser.urlencoded({
    limit: "50mb",
    extended: false
}));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(fileUpload());
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'build')));


app.use('/login', login);
app.use('/profile', profile);
app.use('/chats', chats);
app.use('/suggestion', suggestion);
app.use('/flashcards', flashcards);
app.use('/post', postsRoute);
app.use('/comment', commentRoute);
app.use('/like', likeRoute);

// what port to run server on
server.listen(3001, function () {
    console.log('server started on port 3001');
});
