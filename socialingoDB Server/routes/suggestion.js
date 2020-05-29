var express = require('express');
var router = express.Router();

const con = require("../DBConfig.js");

router.post('/languages', function (req, res) {
    console.log(req.body.userID);
    var sql = `SELECT * FROM Language WHERE LanguageID IN (SELECT LanguageID FROM User_has_Language WHERE UserID = ${req.body.userID})`;
    con.query(sql, function (err, result) {
        res.send(result);
    })
});

router.post('/languagesL', function (req, res) {
    console.log(req.body.userID);
    var sql = `SELECT * FROM Language WHERE LanguageID IN (SELECT LanguageID FROM User_has_Language WHERE UserID = ${req.body.userID} AND isLearning = 1)`;
    con.query(sql, function (err, result) {
        res.send(result);
    })
});

router.post('/movies', function (req, res) {
    console.log(req.body.userID);
    var sql = `SELECT * FROM Movies WHERE MLanguageID IN (SELECT LanguageID FROM Language WHERE LanguageID = ${req.body.languageID})`;
    con.query(sql, function (err, result) {
        res.send(result);
    })
});

router.post('/songs', function (req, res) {
    console.log(req.body.languageID);
    var sql = `SELECT * FROM Songs WHERE SLanguageID IN (SELECT LanguageID FROM Language WHERE LanguageID = ${req.body.languageID})`;
    con.query(sql, function (err, result) {
        res.send(result);
    })
});

router.post('/insertMovie', function (req, res) {
    console.log(req.body.userID);
    var sql = `INSERT INTO Movies (MovieID, MUserID, UserDescription, Type, MLanguageID) VALUES (${req.body.movieID}, ${req.body.userID}, "${req.body.userDescription}", "${req.body.movieType}", ${req.body.movieLanguage})`;
    con.query(sql, function (err, result) {
        res.send(result);
    })
});


router.post('/insertSong', function (req, res) {
    console.log(req.body.userID);
    var sql = `INSERT INTO Songs (SongID, SUserID, UserDescription, SLanguageID) VALUES (${req.body.songID}, ${req.body.userID}, "${req.body.userDescription}", ${req.body.songLanguage})`;
    con.query(sql, function (err, result) {
        res.send(result);
    })
});

module.exports = router;