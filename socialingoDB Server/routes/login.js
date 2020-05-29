var express = require('express');
var router = express.Router();
// const Chatkit = require('@pusher/chatkit-server');

const con = require("../DBConfig.js");

// const chatkit = new Chatkit.default({
//     instanceLocator: 'v1:us1:20385da1-b0ee-4951-94b1-300764c60052',
//     key: 'f713580b-4d6f-410e-a98a-696271cd9887:rkho/x53YXORkNBZBbECLLRxCl5j/Jn/iKjARFM4vsw=',
// })

router.post('/', function (req, res) {
    if (!req.body.username || !req.body.password) {
        res.send('login failed');
    } else {
        var sql = "SELECT * FROM User where Username = ? AND UserPassword = ?";
        con.query(sql, [req.body.username, req.body.password], function (err, result) {
            console.log(result.length);
            if (result.length > 0) {
                let obj = {
                    msg: "Successful",
                    result: result,
                }
                res.send(obj);
            } else {
                let obj = {
                    msg: "Failed!",
                }
                res.send(obj);
            }
        })
    }
});

router.post('/languages', function (req, res) {
    console.log();
    var sql = "SELECT * FROM Language";
    con.query(sql, function (err, result) {
        res.send(result);
    })
});

router.post('/register', function (req, res) {
    var languagesKnown = req.body.languagesKnown;
    var languagesToPractice = req.body.languagesToPractice;


    // chatkit.createUser({
    //     id: req.body.username,
    //     name: req.body.username,
    // }).then(() => {
    //         console.log('User created successfully');
    //     }).catch((err) => {
    //         console.log(err);
    //     });

    let sql = `INSERT INTO User (Username, UserPassword, UserEmail, UserCountry) VALUES ("${req.body.username}", "${req.body.password}", "${req.body.email}", "${req.body.country}")`;

    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log('One record inserted');

        let obj = {
            msg: "Successful!",
            result: result,
        }
        res.send(obj);

        for (var i = 0; i < languagesKnown.length; i++) {
            let sql1 = `INSERT INTO User_has_Language (UserID, LanguageID, isLearning) VALUES (${result.insertId}, ${languagesKnown[i]}, ${false})`;

            con.query(sql1, function (err, result) {
                if (err) throw err;
                console.log('One record inserted');

                // let obj = {
                //     msg: "Successful!",
                //     result: result,
                // }
                // res.send(obj);
            });
        }

        for (var i = 0; i < languagesToPractice.length; i++) {
            let sql2 = `INSERT INTO User_has_Language (UserID, LanguageID, isLearning) VALUES (${result.insertId}, ${languagesToPractice[i]}, ${true})`;

            con.query(sql2, function (err, result) {
                if (err) throw err;
                console.log('One record inserted');

                // let obj = {
                //     msg: "Successful!",
                //     result: result,
                // }
                // res.send(obj);
            });
        }
    });
});

router.post("/upload", function (req, res) {
    let userImage = req.files.file.data;
    // let buffer = new Buffer.alloc(flashcardImage.size, flashcardImage.data);
    let userID = req.headers.id;
    // console.log(userID);

    if (userID !== "undefined") {
        let sql = `UPDATE User SET ProfilePicture = ? WHERE UserID = ?;`;
        console.log(userID);
        con.query(sql, [userImage, userID], function (err, result) {
            if (err) throw err;
            console.log('Record updated');
            res.send(result);
        });
    } else {
        res.send("Failed");
    }
});

module.exports = router;