var express = require('express');
var router = express.Router();

const con = require("../DBConfig.js");

router.post('/', function (req, res) {

    var sql = "SELECT * FROM User where userID = ?";
    con.query(sql, [req.body.userID], function (err, result) {
        console.log(result[0]);
        var user = result[0];

        var sql = "SELECT * FROM Language WHERE LanguageID IN (SELECT LanguageID FROM User_has_Language WHERE UserID = ? AND isLearning = 0)";
        con.query(sql, [req.body.userID], function (err, result) {
            console.log(result);
            var knownLang = result;

            var sql = "SELECT * FROM Language WHERE LanguageID IN (SELECT LanguageID FROM User_has_Language WHERE UserID = ? AND isLearning = 1)";
            con.query(sql, [req.body.userID], function (err, result) {
                console.log(result);
                var langToLearn = result;

                let obj = {
                    user: user,
                    knownLang: knownLang,
                    langToLearn: langToLearn,
                }
                res.send(obj);

                // res.send(result[0]);
            });
            // res.send(result[0]);
        });
    });
});

router.post('/picture', function (req, res) {

    var sql = "SELECT ProfilePicture FROM User where userID = ?";
    con.query(sql, [req.body.userID], function (err, result) {
        console.log(result[0]);
        res.send(result[0]);
    })
});

router.post('/movies', function (req, res) {
    console.log(req.body.userID);
    var sql = `SELECT * FROM Movies WHERE MUserID IN (SELECT UserID FROM User WHERE UserID = ${req.body.userID})`;
    con.query(sql, function (err, result) {
        console.log(result);
        res.send(result);
    })
});

router.post('/songs', function (req, res) {
    var sql = `SELECT * FROM Songs WHERE SUserID IN (SELECT UserID FROM User WHERE UserID = ${req.body.userID})`;
    con.query(sql, function (err, result) {
        console.log(sql);
        res.send(result);
    })
});

module.exports = router;