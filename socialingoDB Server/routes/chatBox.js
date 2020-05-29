var express = require('express');
var router = express.Router();


const con = require("../DBConfig.js");

router.post('/getRides', function (req, res, next) {
    var io = req.app.get('socketio');

    // io.to(//socket.id//).emit("message", data);

});